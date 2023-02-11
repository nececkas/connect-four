import { useState, useRef } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Modal from '@mui/material/Modal'

import { socket } from './index'
import GameBoard from './components/GameBoard'
import NewGameRoomButton from './components/NewGameRoomButton'
import usePlayerSetup from './hooks/usePlayerSetup'

/**
 * These are the values that represent each slot in the game board.
 * So, for example, if for the first move of the game, a player 
 * placed a disc into the leftmost column, the disc would fall 
 * into the 'A' column, and travel to the spot closest to the 
 * bottom that's available. On the first move of the game, that would be
 * 'A6'.
 */
export const gameBoard = [
  'A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1',
  'A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2',
  'A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3',
  'A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4',
  'A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5',
  'A6', 'B6', 'C6', 'D6', 'E6', 'F6', 'G6',
]


function App() {
  // Who gets to the next move?  Main or Invited
  // const [currentPlayer, setCurrentPlayer] = useState('')
  // NOTE: Initially, I was tracking this at the top level, but I just moved
  // the tiny component that relies it down so that I could move the state 
  // closer to where it's mostly consumed.  Now it's 'lastMoveByPlayer' 
  // in GameBoard.
  // Is a game of connect four in progress?
  const [gameInProgress, setGameInProgress] = useState(false)
  // Receive game winner's name at the end of the game (can be No One for a draw)
  const [winner, setWinner] = useState('')
  // Control modal that only opens at end of game
  const [modalOpen, setModalOpen] = useState(false)
  // Track room, which is necessary to send moves to only that socket room
  const [room, setRoom] = useState('')
  // Room is used to generate link that Invited Player pastes into browser
  const invitationLink = `http://localhost:8080/${room}`
  // This is only necessary to delete link after Invited player takes first move
  const [inviteeAccepted, setInviteeAccepted] = useState(false)


  /**
   * The remaining available moves are tracked in a ref.  A ref seemed like a 
   * better option than state, since I didn't anticipate wanting to change the 
   * entire board every time someone made a move.  The availableMoves is 
   * populated initially in the useGameSetup hook below
   */
  const availableMoves = useRef([])

  const handleStartGame = (newRoom) => {
    setGameInProgress(true) // Game is marked as in progress
    availableMoves.current = gameBoard // List all moves in board as available
    setInviteeAccepted(false) // Changes when invitee makes first move
    setRoom(newRoom) // Sets room used for socket communications
  }

  const handleGameWin = (newWinner) => {
    setWinner(newWinner)
    setGameInProgress(false)
    socket.emit('leave-room', room)
    setRoom('')
    setModalOpen(true)
  }


  // 1. Designates who is "Main" and who is "Invited" player. 
  // 2. Handles invited player joining room and game setup for Invited player.
  const player = usePlayerSetup({ handleStartGame })


  return (
    <div className="App">
      <header className="App-header">
        <h1>Connect Four</h1>
        <h2>{player} Player</h2>
      </header>

      <Divider />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        className='modal'
      >
        <Box className="modal--box" sx={{ p: 4 }}>
          <h2 className="modal--content">{winner} Wins!</h2>
          <h3 className="modal--content">
            {(winner === 'No One')
              ? "Aren't ties the best?"
              : (winner.startsWith(player))
                ? 'Congratulations, rock start!'
                : "...but you'll get 'em next time!"
            }
          </h3>
          {player === 'Main' && <p className="modal--content">Want to play again?  Just create a new game room.</p>}
        </Box>
      </Modal>



      {/* The JoinRoom component, which allows a user to create a new 
      game space / socket room and generates a link to invite another player,
      should only render if there is no game in progress and only for 
      the Main player.  I wanted to conditionally render the component so that
      it's removed from the tree when no longer needed.  That way, it's state 
      will re-initialize at the end of the game when the Main player has the 
      option to create a new game spacem and so clicking the button will cause
      the Main player to join a new socket room and generate a link for the 
      new room. */}
      {(!gameInProgress && player === 'Main')
        ? <NewGameRoomButton onStartGame={handleStartGame} setRoom={setRoom} />
        : null
      }

      {(!inviteeAccepted && room && player === 'Main')
        ? <>
          <h4>Copy this link into another browser window to invite a friend!</h4>
          <h4>{invitationLink}</h4>
        </>
        : null
      }


      <GameBoard
        availableMoves={availableMoves}
        gameInProgress={gameInProgress}
        inviteeAccepted={inviteeAccepted}
        onGameWin={handleGameWin}
        player={player}
        room={room}
        setInviteeAccepted={setInviteeAccepted}
      />

    </div>
  );
}

export default App;
