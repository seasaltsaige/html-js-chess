/**
 * creates a duplicate board
 * used for testing if moves are legal
 * @param {string[][]} board old board
 * @returns {string[][]}
 */
 function duplicateBoard(board) {
  const b = [];
  for (let i = 0; i < board.length; i++) {
    b.push([]);
    for (let j = 0; j < board[i].length; j++) {
      b[i].push(board[i][j]);
    }
  }
  return b;
}