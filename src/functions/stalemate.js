/**
 * Checks for stalemate
 * @param {King} king the current king to check stalemate for
 * @param {string[][]} board the current board position
 * @param {Piece[]} pieceArray the current array of pieces
 * @returns {boolean}
 */
function stalemate(king, board, pieceArray) {
  const oppPieces = pieceArray.filter(p => p.color !== king.color).filter(p => p.piece_type[1] !== "k");
  // check if the king has no legal moves, but is NOT being attacked in the current board position
  if (filterLegalMoves(king, board, pieceArray).length < 1 && !kingAttacked(king, oppPieces, board, pieceArray)) {
    // get team pieces
    const teamPieces = pieceArray.filter(p => p.color === king.color).filter(p => p.piece_type[1] !== "k");
    let anyLegalMoves = [];
    // go through each piece, check if they have legal moves
    // add any legal moves to the array above
    for (const p of teamPieces) {
      const legalMoves = filterLegalMoves(p, board, pieceArray);
      anyLegalMoves = anyLegalMoves.concat(legalMoves);
    }
    // if there is no legal moves for any other pieces, it is stalemate
    if (anyLegalMoves.length < 1) return true;
  }  
}