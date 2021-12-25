/**
 * @param {Piece} piece 
 * @param {string[][]} board
 * @param {Piece[]} pieceArray
 * @param {string} enPassant
 * @returns {[number, number][]}
 */
 function filterLegalMoves(piece, board, pieceArray, enPassant) {

  const whitePieces = pieceArray.filter(p => p.color === "w");
  const blackPieces = pieceArray.filter(p => p.color === "b");

  const opponentPieces = (piece.color === "w" ? blackPieces : whitePieces).filter(p => p.piece_type[1] !== "k");
  const teamPieces = piece.color === "w" ? whitePieces : blackPieces;
  let moves = piece.getMoves(board, pieceArray, enPassant);
  if (piece.piece_type[1] === "k") {
    const unattacked_moves = [];

    const correct_row = piece.color === "w" ? 7 : 0;

    const qsbr = [
      [correct_row, 1], [correct_row, 2], [correct_row, 3],
    ];
    const ksbr = [
      [correct_row, 5], [correct_row, 6],
    ];

    outer: for (const move of moves) {
      if (typeof move === "string") {
        let squares = [];
        if (move === "king_side_castle") 
          squares = ksbr;
        else if (move === "queen_side_castle") 
          squares = qsbr;

        for (const otherPiece of opponentPieces) {
          const otherPieceMoves = otherPiece.getMoves(board, pieceArray, enPassant);
          for (const s of squares) {
            for (const opMv of otherPieceMoves) {
              if (s[0] === opMv[1] && s[1] === opMv[0]) 
                continue outer;
            }
          }
        }
        unattacked_moves.push(move);
      } else {
        for (const otherPiece of opponentPieces) {

          if (otherPiece.piece_type[1] === "p") {
            const pawnMoves = otherPiece.getMoves(board, pieceArray, enPassant);
            const correctMoves = pawnMoves.filter(m => m[1] !== move[1]);
            if (correctMoves.find(v => v[0] === move[0] && v[1] === move[1]))
              continue outer;
          } else {

            const pMoves = otherPiece.getMoves(board, pieceArray, enPassant);
            if (pMoves.find(v => v[0] === move[0] && v[1] === move[1]))
              continue outer;
          }
        }

        unattacked_moves.push(move);
      }
    }


    const legalMoves = [];
    const kingActualPos = piece.location;

    for (const move of unattacked_moves) {
      if (typeof move === "string") {
        legalMoves.push(move);
        continue;
      }
      let tempBoard = duplicateBoard(board);
      let dupePieces = dupePiecesArray(pieceArray);
      tempBoard[kingActualPos[0]][kingActualPos[1]] = "";
      const oldSpot = tempBoard[move[1]][move[0]];

      if (oldSpot !== "")
        dupePieces.splice(dupePieces.findIndex(p => p.location[0] === move[1] && p.location[1] === move[0]), 1);

      let newOppPieces = dupePieces.filter(p => p.color !== piece.color).filter(p => p.piece_type !== "k");

      tempBoard[move[1]][move[0]] = piece.piece_type;
      piece.location = [move[1], move[0]];
      if (!kingAttacked(piece, newOppPieces, tempBoard, dupePieces))
        legalMoves.push(move);
    }

    piece.location = kingActualPos;

    return legalMoves;
  } else {
    const legalMoves = [];
    const samePieceKing = teamPieces.find(p => p.piece_type[1] === "k");
    for (const move of moves) {
      let tempBoard = duplicateBoard(board);
      let dupePieces = dupePiecesArray(pieceArray);
        
      tempBoard[piece.location[0]][piece.location[1]] = "";
      const oldSpot = tempBoard[move[1]][move[0]];
      if (oldSpot !== "")
        dupePieces.splice(dupePieces.findIndex(p => p.location[0] === move[1] && p.location[1] === move[0]), 1);

      let newOppPieces = dupePieces.filter(p => p.color !== piece.color).filter(p => p.piece_type !== "k");
      tempBoard[move[1]][move[0]] = piece.piece_type;
      if (!kingAttacked(samePieceKing, newOppPieces, tempBoard, dupePieces))
        legalMoves.push(move);
    }
    return legalMoves;
  }
}