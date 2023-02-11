import { winningCombos } from './../constants/winningCombos'

const checkForWinner = ({ playerMoves, move }) => {

  console.log('playerMoves.length', playerMoves.length)
  if (playerMoves.length < 4) return false; // Impossible to win with less than 4 moves

  // Filter winningCombos down to only those that contain the player's latest
  // move.  Since that's the only thing that's changed on the board, any 
  // winning combo necessarily has to include that value.
  // (Each item in winningCombos is an array, e.g. ['A1', 'B1', 'C1', 'D1'])
  const possibleWinningCombos = winningCombos.filter(itemArray => {
    return itemArray.includes(move)
  })

  console.log('possibleWinningCombos', possibleWinningCombos)

  /**
   * Now that the possible combos to check against has been winnowed down,
   * it's time for the more costly operation: Check if the player has all
   * of the elements in any of the winning combos.
   */
  const actualWinningCombos = possibleWinningCombos.filter(itemArray => {
    return itemArray.every(item => playerMoves.includes(item))
  })

  if (actualWinningCombos.length === 0) {
    return false
  } else {
    return true
  }
}

export default checkForWinner;