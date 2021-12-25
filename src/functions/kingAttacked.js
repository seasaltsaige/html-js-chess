/**
 * @param {King} king 
 * @param {Piece[]} opponentPieces 
 * @param {string[][]} board
 * @param {Piece[]} pieceArray
 * @param {Piece} piece
 */
 function kingAttacked(king, opponentPieces, board, pieceArray, enPassant) {
  let kingAttacked = false;

  outer: for (const oppPiece of opponentPieces) {
    const oppMoves = oppPiece.getMoves(board, pieceArray);
    for (const m of oppMoves) {
      if (m[1] === king.location[0] && m[0] === king.location[1]) {
        kingAttacked = true;
        break outer;
      }
    }
  }

  return kingAttacked;
}