/**
 * Check if the king is actively being attacked in the current position
 * @param {King} king King to check for
 * @param {Piece[]} opponentPieces opponents pieces
 * @param {string[][]} board current board position
 * @param {Piece[]} pieceArray array of all pieces in play
 * @returns {boolean}
 */
function kingAttacked(king, opponentPieces, board, pieceArray) {
  // assume the king is not being attacked
  let kingAttacked = false;

  // for this context, it does not matter if an opponents piece can move or not
  // (ie: it is pinned), if a piece has line of sight with the king, the king
  // is being attacked
  
  // go through each of the opponents pieces
  outer: for (const oppPiece of opponentPieces) {
    // get each "sudo-legal" move
    const oppMoves = oppPiece.getMoves(board, pieceArray);
    // go through each move
    for (const m of oppMoves) {
      // if any move is equal to the kings current position
      // the king is being attacked
      if (m[1] === king.location[0] && m[0] === king.location[1]) {
        kingAttacked = true;
        break outer;
      }
    }
  }
  
  return kingAttacked;
}