/**
 * @param {Piece[]} pieceArray 
 */
 function insufficientMaterial(pieceArray) {
  const blackPieces = pieceArray.filter(p => p.color === "b");
  const whitePieces = pieceArray.filter(p => p.color === "w");

  if (!blackPieces.find(p => p.piece_type === "bp") && 
  !whitePieces.find(p => p.piece_type === "wp")) {

    if (blackPieces.length < 4 && whitePieces.length < 4) {
      if (blackPieces.length < 3 && whitePieces.length < 3) {
        if (!blackPieces.find(p => p.piece_type === "br") && 
        !whitePieces.find(p => p.piece_type === "wr"))
          return true;
        else return false;
      } else if (whitePieces.length === 1 && blackPieces.length === 3) {
        if (!blackPieces.find(p => p.piece_type === "br")) {
          if (blackPieces.filter(p => p.piece_type === "bn").length === 2)
            return true;
          else return false;
        } else return false;
      } else if (blackPieces.length === 1 && whitePieces.length === 3) {
        if (!whitePieces.find(p => p.piece_type === "wr")) {
          if (whitePieces.filter(p => p.piece_type === "wn").length === 2)
            return true;
          else return false;
        } else return false;
      } else return false;
    } else return false;
  } else return false;
}