/**
 * Checks for specific cases that are known to be unwinable 
 * @link https://support.chess.com/article/128-what-does-insufficient-mating-material-mean
 * @param {Piece[]} pieceArray array of all pieces currently in the game
 * @returns {boolean}
 */
function insufficientMaterial(pieceArray) {
  // get white and black pieces
  const blackPieces = pieceArray.filter(p => p.color === "b");
  const whitePieces = pieceArray.filter(p => p.color === "w");

  // if there are pawns in the board, they can theoretically be promoted
  // to a better piece and allow checkmate, this checks that
  if (!blackPieces.find(p => p.piece_type === "bp") && 
  !whitePieces.find(p => p.piece_type === "wp")) {

    // if both players have 3 or fewer pieces left
    if (blackPieces.length < 4 && whitePieces.length < 4) {
      // if both players have only 2 pieces left, their king and another piece
      if (blackPieces.length < 3 && whitePieces.length < 3) {
        // if neither player has a rook or a queen there is not enough
        // material to force checkmate
        if ((!blackPieces.find(p => p.piece_type === "br") && 
        !whitePieces.find(p => p.piece_type === "wr")) &&
        (!blackPieces.find(p => p.piece_type === "bq") && 
        !whitePieces.find(p => p.piece_type === "wq")))
          return true;
        else return false;
      // if one player only has a king and the other has two knights
      // checkmate can not be forced, draw occurs
      } else if (whitePieces.length === 1 && blackPieces.length === 3) {
        if (blackPieces.filter(p => p.piece_type === "bn").length === 2)
          return true;
        else return false;
      // same logic for other color
      } else if (blackPieces.length === 1 && whitePieces.length === 3) {
        if (whitePieces.filter(p => p.piece_type === "wn").length === 2)
          return true;
        else return false;
      } else return false;
    // if either player has more that 3 pieces, a checkmate can be given
    } else return false;
  // pawn is present, no draw
  } else return false;
}