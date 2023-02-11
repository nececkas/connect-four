/**
 * In this app's Connect Four board, each of the seven columns is 
 * represented with a letter, with A on the left and G on the right.
 * Each of the rows of the six columns is represented with a number,
 * with 1 on the top (where the discs enter) and 6 on the bottom 
 * (where the first disc in a particular column will fall).  There's 
 * an unmanagabely large number of board positions, but if one focuses 
 * on just the winning line of four discs, there's a finite list of 
 * winning combinations.  The constant below lists all those combinations
 * and is used elsewhere to calculate whether a player has won the game.
 */
const winningCombos = [
  // ROWS - starting furthest left and top, moving fist down, then right
  // furthest left
  ['A1', 'B1', 'C1', 'D1'],
  ['A2', 'B2', 'C2', 'D2'],
  ['A3', 'B3', 'C3', 'D3'],
  ['A4', 'B4', 'C4', 'D4'],
  ['A5', 'B5', 'C5', 'D5'],
  ['A6', 'B6', 'C6', 'D6'],
  // rows, one over
  ['B1', 'C1', 'D1', 'E1'],
  ['B2', 'C2', 'D2', 'E2'],
  ['B3', 'C3', 'D3', 'E3'],
  ['B4', 'C4', 'D4', 'E4'],
  ['B5', 'C5', 'D5', 'E5'],
  ['B6', 'C6', 'D6', 'E6'],
  // rows, two over
  ['C1', 'D1', 'E1', 'F1'],
  ['C2', 'D2', 'E2', 'F2'],
  ['C3', 'D3', 'E3', 'F3'],
  ['C4', 'D4', 'E4', 'F4'],
  ['C5', 'D5', 'E5', 'F5'],
  ['C6', 'D6', 'E6', 'F6'],
  // rows, three over, aka furthest right
  ['D1', 'E1', 'F1', 'G1'],
  ['D2', 'E2', 'F2', 'G2'],
  ['D3', 'E3', 'F3', 'G3'],
  ['D4', 'E4', 'F4', 'G4'],
  ['D5', 'E5', 'F5', 'G5'],
  ['D6', 'E6', 'F6', 'G6'],

  // COLUMNS, starting in top left, moving first down, then over
  // column A
  ['A1', 'A2', 'A3', 'A4'],
  ['A2', 'A3', 'A4', 'A5'],
  ['A3', 'A4', 'A5', 'A6'],
  // column B
  ['B1', 'B2', 'B3', 'B4'],
  ['B2', 'B3', 'B4', 'B5'],
  ['B3', 'B4', 'B5', 'B6'],
  // column C
  ['C1', 'C2', 'C3', 'C4'],
  ['C2', 'C3', 'C4', 'C5'],
  ['C3', 'C4', 'C5', 'C6'],
  // column D
  ['D1', 'D2', 'D3', 'D4'],
  ['D2', 'D3', 'D4', 'D5'],
  ['D3', 'D4', 'D5', 'D6'],
  // column E
  ['E1', 'E2', 'E3', 'E4'],
  ['E2', 'E3', 'E4', 'E5'],
  ['E3', 'E4', 'E5', 'E6'],
  // column F
  ['F1', 'F2', 'F3', 'F4'],
  ['F2', 'F3', 'F4', 'F5'],
  ['F3', 'F4', 'F5', 'F6'],
  // column G
  ['G1', 'G2', 'G3', 'G4'],
  ['G2', 'G3', 'G4', 'G5'],
  ['G3', 'G4', 'G5', 'G6'],

  // DIAGONOLS ORIENTED IN TOP-LEFT, BOTTOM-RIGHT ORIENTATION
  // starting in top left, moving down, then over
  // first orienation of diagonals, furthest left
  ['A1', 'B2', 'C3', 'D4'],
  ['A2', 'B3', 'C4', 'D5'],
  ['A3', 'B4', 'C5', 'D6'],
  // first orienation of diagonals, one over 
  ['B1', 'C2', 'D3', 'E4'],
  ['B2', 'C3', 'D4', 'E5'],
  ['B3', 'C4', 'D5', 'E6'],
  // first orienation of diagonals, two over
  ['C1', 'D2', 'E3', 'F4'],
  ['C2', 'D3', 'E4', 'F5'],
  ['C3', 'D4', 'E5', 'F6'],
  // first orienation of diagonals, three over, aka furthest right
  ['D1', 'E2', 'F3', 'G4'],
  ['D2', 'E3', 'F4', 'G5'],
  ['D3', 'E4', 'F5', 'G6'],

  // DIAGONOLS ORIENTED IN TOP-RIGHT, BOTTOM-LEFT ORIENTATION
  // starting in top right, moving down, then over
  // second orienation of diagonals, furthest right
  ['G1', 'F2', 'E3', 'D4'],
  ['G2', 'F3', 'E4', 'D5'],
  ['G3', 'F4', 'E5', 'D6'],
  // second orienation of diagonals, one over
  ['F1', 'E2', 'D3', 'C4'],
  ['F2', 'E3', 'D4', 'C5'],
  ['F3', 'E4', 'D5', 'C6'],
  // second orienation of diagonals, two over
  ['E1', 'D2', 'C3', 'B4'],
  ['E2', 'D3', 'C4', 'B5'],
  ['E3', 'D4', 'C5', 'B6'],
  // second orienation of diagonals, three over, aka furthest left
  ['D1', 'C2', 'B3', 'A4'],
  ['D2', 'C3', 'B4', 'A5'],
  ['D3', 'C4', 'B5', 'A6'],
]

export { winningCombos }