/**
 * @param  {[number, number]} param0 
 * @param {string[][]} board 
 * @returns {string}
 */
 function cordsToBoardSquare(board, ...[x,y]) {
  const [xx,yy] = [floor100(x) / 100, floor100(y)/ 100];
  return board[yy][xx];
}