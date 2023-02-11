import checkForDraw from './checkForDraw'
import checkForWinner from './checkForWinner'

/**
 * createHandleMove returns a funciton that (1) checks for a winner 
 * (or draw) and (2) updates the state of lastMove and lastMoveByPlayer,
 * which are needed to change the UI which displays the discs.
 * 
 * This utility mostly exists to minimize duplication of code 
 * and remove some of the logic that was make GameBoard and
 * useReceiveMove hard to follow.  
 * 
 * It returns a function definition,
 * just so that it's possible to create a closure over 
 * the needed parameters, which can be found in the 
 * GameBoard component.  
 * 
 * The returned function is called both
 * by the user who clicks on a button when it's their turn,
 * as well as the useReceiveMove hook, which listens for any 
 * moves by the other player via the socket.
 */

const createHandleMove = ({
  availableMoves,
  invitedPlayerMoves,
  mainPlayerMoves,
  onGameWin,
  setInviteeAccepted,
  setLastMove,
  setLastMoveByPlayer
}) => (move, moveBy) => {
  /**
   * Update refs tracking players moves, so as to check for win condition.
   * Update lastMoveByPlayer and lastMove, which is needed to draw/color discs.
   */
  if (moveBy === 'Invited') {
    invitedPlayerMoves.current.push(move)
    setLastMoveByPlayer('Invited')
  } else {
    mainPlayerMoves.current.push(move)
    setLastMoveByPlayer('Main')
  }

  setLastMove(move)

  /**
   * Update availableMoves so that players can only put disc into 
   * an available slot.
   */
  availableMoves.current = availableMoves.current.filter(item => item !== move)

  /** 
   * Check for winner and call onWinner, which is defined in App and handles
   * logic about opening a modal announcing the winner.
   */
  const playerMoves = (moveBy === 'Main')
    ? mainPlayerMoves.current
    : invitedPlayerMoves.current
  const isWinner = checkForWinner({ playerMoves, move })

  if (isWinner) onGameWin(`${moveBy} Player`)

  /**
   * A draw can occur when there are no available spaces left in which a 
   * disc can be put.
   */
  const isDraw = checkForDraw({ availableMoves })
  if (isDraw) onGameWin('No One')

  /**
   * Setting setInviteeAccepted allows the invitation link on the 
   * Main player's page to disappear.  Calling the setter function here
   * isn't ideal, since it only needs to be called once.  But it's a 
   * cheap function, and it's not going to cause the whole app to rerender
   * since the value will stay as true after the first time this function
   * executes.
   */
  setInviteeAccepted(true)

}

export default createHandleMove;