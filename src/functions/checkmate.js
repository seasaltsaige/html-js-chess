/**
 * Checks checkmate
 * @param {King} king the current king to check checkmate for
 * @param {string[][]} board the currend board position
 * @param {Piece[]} pieceArray the current array of pieces in play
 * @returns {boolean}
 */
function checkmate(king, board, pieceArray) {
  const oppPieces = pieceArray.filter(p => p.color !== king.color).filter(p => p.piece_type[1] !== "k");
  // if the king has no legal moves and the king IS being attacked, continue
  if (filterLegalMoves(king, board, pieceArray).length < 1 && kingAttacked(king, oppPieces, board, pieceArray)) {
    // get the team pieces
    const teamPieces = pieceArray.filter(p => p.color === king.color).filter(p => p.piece_type[1] !== "k");
    let anyLegalMoves = [];

    // go through each team piece, and if add any legal moves to the array above
    for (const p of teamPieces) {
      const legalMoves = filterLegalMoves(p, board, pieceArray);
      anyLegalMoves = anyLegalMoves.concat(legalMoves);
    }

    // if no piece has any legal move, the king is in checkmate
    if (anyLegalMoves.length < 1) return true;

  }  
}