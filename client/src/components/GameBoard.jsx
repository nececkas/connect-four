import { useState, useEffect, useRef } from 'react'
import IconButton from '@mui/material/IconButton'
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

import { gameBoard } from './../App'
import useReceiveMove from './../hooks/useReceiveMove'
import { socket } from './../index'
import createHandleMove from './../utils/createHandleMove'

const svgBaseDimension = 100
const svgWidth = 700
const svgHeight = 600

/**
 * Just a simple object that'll make calculating the location of each 
 * disc a little bit easier.
 */
const letterNumbers = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6 }

const Disc = ({
  cx,
  cy,
  setToRed = false,
  setToYellow = false,
  setToWhite = false
}) => {
  /**
   * All of the discs start out white so they blend in with the background.
   * The useEffect only changes color when the lastMove matches the value 
   * of the disc.  
   * 
   * So if the lastMove was "G2", either setToRed or setToYellow will be true,
   * depending on whether the last move was by the Main or Invited player.  
   * The logic handling this is in the return statement of GameBoard that 
   * generates these discs by mapping.  I set it up this way so that even if
   * the props change, the state will not often change, and hopefully React
   * will know not to actually repaint the discs based on the diffing it does
   * during re-rendering.
   * 
   * The if statments in the useEffect also mean that the color only ever 
   * changes TO yellow or TO red (i.e. the color persists once a player 
   * makes a move) during a game.  
   * 
   * The setToWhite function only comes into
   * play if the state of 'room' is a string and 'inviteeAccepted' is false,
   * which should only ever be true at the start of a new game.  
   * (i.e. This allows the Main player's board to look blank if they start a
   * second game.)
   */
  const [color, setColor] = useState('white')

  useEffect(() => {
    if (setToRed) setColor('red')
    if (setToYellow) setColor('yellow')
    if (setToWhite) setColor('white')
  }, [setToRed, setToYellow, setToWhite])

  return (
    <circle
      cx={cx}
      cy={cy}
      fill={color}
      r={(svgBaseDimension / 2) - 2}
    />
  )
}


const GameBoard = ({
  availableMoves,
  gameInProgress,
  inviteeAccepted,
  onGameWin,
  player,
  room,
  setInviteeAccepted
}) => {
  const [lastMove, setLastMove] = useState('')
  // Default state of lastMoveByPlayer ensures that Invited player goes 1st.
  const [lastMoveByPlayer, setLastMoveByPlayer] = useState('Main')

  /**
   * Keep track of moves made by Main and Invited player in refs
   * rather than state.  I made that choice because the
   * the app isn't using the whole board to update, but rather updating 
   * the color of the discs as it goes.
   * 
   * I thought about reworking the app to keep track of the state on the
   * backend, since one player refreshing their page messes up the app.
   */
  const mainPlayerMoves = useRef([])
  const invitedPlayerMoves = useRef([])

  /**
   * Used to reset game to start conditions when Main player chooses to 
   * start a second game.
   * - Changes the disc to white
   * - Resets the lastMove and lastMoveByPlayer so Invited player starts
   * - Resets the refs that take place of what moves have occurred 
   */

  const newGame = Boolean(room && !inviteeAccepted)
  useEffect(() => {
    if (newGame) {
      setLastMove('')
      setLastMoveByPlayer('Main')
      mainPlayerMoves.current = []
      invitedPlayerMoves.current = []
    }
  }, [newGame])


  // handleMove checks for winner and updates state so disc color can be changed
  const handleMove = createHandleMove({
    availableMoves,
    invitedPlayerMoves,
    mainPlayerMoves,
    onGameWin,
    setInviteeAccepted,
    setLastMove,
    setLastMoveByPlayer,
  })

  // Listen for moves from other player
  useReceiveMove({ handleMove })

  /**
   * handleSelectMove handles when user clicks one of the arrow buttons 
   * at the top of the game board to select which column they want to drop 
   * a disc into.
   * 
   * Most of the logic here is required to figure out what move occurred
   * and send it to the socket to be transmitted to the other player. The 
   * function also uses the handleMove function created above.
   */
  const handleSelectMove = (buttonId) => (e) => {
    e.preventDefault()

    if (!room) return; // If Main player has not started game, do nothing

    const availableMovesInColumn = availableMoves.current.filter((item) => {
      // Ex. item is 'A1' or 'G2'.  Get column matching button clicked.
      return item.startsWith(buttonId)
    })

    // If no available moves (i.e. b/c column is filled), do nothing
    if (availableMovesInColumn.length === 0) return;

    // Determine next move, i.e. lowest spot and HIGHEST number (e.g. 'D6')
    const numbersInColumn = availableMovesInColumn.map(item => {
      return parseInt(item.split('')[1])
    })
    const move = `${buttonId}${Math.max(...numbersInColumn)}`

    // Send move to socket so that other user's app can update
    socket.emit('send-move', room, move, player)

    // Now handle the move, i.e. for updating image and checking for winner
    handleMove(move, player)
  }

  // Heading to indicate who's move is next
  const nextMove = (lastMoveByPlayer !== player)
    ? <h3>Your Move</h3>
    : <h3>Your Opponent's Move</h3>

  return (
    <>
      <div className='centering-container'>
        {nextMove}
      </div>
      <div className='spacing-container'>
        {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(buttonId => {
          return (
            <IconButton
              aria-label={`column-${buttonId}-button`}
              disabled={Boolean(!gameInProgress || lastMoveByPlayer === player)}
              key={`Arrow${buttonId}`}
              onClick={handleSelectMove(buttonId)}
              sx={{ color: '#63e5ff' }}
            >
              <ArrowCircleDownIcon />
            </IconButton>
          )

        })}
      </div>
      <svg width={svgWidth + 1} height={svgHeight + 1} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="connect-four" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="blue" strokeWidth="3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#connect-four)" />
        {gameBoard.map((item) => {
          // Remember: each disc spot is labeled, e.g. 'A1' or 'D5'
          const [letter, num] = item.split('')
          const cx = letterNumbers[letter] * svgBaseDimension + (svgBaseDimension / 2)
          const cy = (num - 1) * svgBaseDimension + (svgBaseDimension / 2)
          const setToRed = lastMoveByPlayer === 'Main' && item === lastMove
          const setToYellow = lastMoveByPlayer === 'Invited' && item === lastMove
          return (
            <Disc
              key={item}
              cx={cx}
              cy={cy}
              setToRed={setToRed}
              setToYellow={setToYellow}
              setToWhite={newGame}
            />
          )
        })}
      </svg>
    </>
  );
}

export default GameBoard;