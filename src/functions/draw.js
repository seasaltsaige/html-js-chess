/**
 * 
 * @param {King} king 
 * @param {string[][]} board 
 * @param {Piece[]} pieceArray 
 */
 function draw(king, board, pieceArray) {
  if (filterLegalMoves(king, board, pieceArray).length < 1 && !kingAttacked(king, pieceArray.filter(p => p.color !== king.color).filter(p => p.piece_type[1] !== "k"), board, pieceArray)) {
    const teamPieces = pieceArray.filter(p => p.color === king.color).filter(p => p.piece_type[1] !== "k");
    let anyLegalMoves = [];

    for (const p of teamPieces) {
      const legalMoves = filterLegalMoves(p, board, pieceArray);
      anyLegalMoves = anyLegalMoves.concat(legalMoves);
    }

    if (anyLegalMoves.length < 1) return true;
  }  
}