const checkForDraw = ({ availableMoves }) => {
  if (availableMoves.current.length === 0) return true;

  return false;
}

export default checkForDraw;