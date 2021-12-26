/**
 * Filter out legal moves for pieces. For the king, make sure the square isn't being attacked, for other pieces, make sure the king isnt in check, and if it is, only allow moves that get the king out of check
 * @param {Piece} piece 
 * @param {string[][]} board
 * @param {Piece[]} pieceArray
 * @param {string} enPassant
 * @returns {[number, number][]} returns array of LEGAL moves for the provided piece
 */
 function filterLegalMoves(piece, board, pieceArray, enPassant) {

  // get opponent and team pieces
  const whitePieces = pieceArray.filter(p => p.color === "w");
  const blackPieces = pieceArray.filter(p => p.color === "b");

  const opponentPieces = piece.color === "w" ? blackPieces : whitePieces
  const teamPieces = piece.color === "w" ? whitePieces : blackPieces;
  // get all possible (illegal or legal) moves for the pieces
  let moves = piece.getMoves(board, pieceArray, enPassant);

  // if we are dealing with a king
  if (piece.piece_type[1] === "k") {
    const unattacked_moves = [];

    // back rank for color
    const correct_row = piece.color === "w" ? 7 : 0;

    const qsbr = [
      [correct_row, 1], [correct_row, 2], [correct_row, 3],
    ];
    const ksbr = [
      [correct_row, 5], [correct_row, 6],
    ];
    // itterate through each move
    outer: for (const move of moves) {
      // if its a string, there is a possibility of castling
      if (typeof move === "string") {
        let squares = [];
        // set squares to the correct side
        // kingside or queenside
        if (move === "king_side_castle") 
          squares = ksbr;
        else if (move === "queen_side_castle") 
          squares = qsbr;

        // go through each of the opponents pieces
        for (const otherPiece of opponentPieces) {
          // get each move for it (in this case, it doesn't matter if its a legal move or not
          // ie: if a bishop is pinned to the king, the other king still cant move into line of sight
          // because it would still be check)
          const otherPieceMoves = otherPiece.getMoves(board, pieceArray, enPassant);
          // for each of the backrank squares
          for (const s of squares) {
            // go through each move
            for (const opMv of otherPieceMoves) {
              // if the move is the same as the back rank square
              if (s[0] === opMv[1] && s[1] === opMv[0]) 
                // you can not castle on this side
                continue outer;
            }
          }
        }
        // otherwise add move to unattacked moves
        unattacked_moves.push(move);
      } else {
        // not a castle move
        // go through each opponent piece
        for (const otherPiece of opponentPieces) {
          // if its a pawn
          if (otherPiece.piece_type[1] === "p") {
            // i think this filters out the normal forward pawn moves? because pawns attack
            // diagonally and not forward. I kind of forgot though
            const pawnMoves = otherPiece.getMoves(board, pieceArray, enPassant);
            const correctMoves = pawnMoves.filter(m => m[1] !== move[1]);
            if (correctMoves.find(v => v[0] === move[0] && v[1] === move[1]))
              continue outer;
          } else {
            // if the space is part of the pieces move array, 
            // continue
            const pMoves = otherPiece.getMoves(board, pieceArray, enPassant);
            if (pMoves.find(v => v[0] === move[0] && v[1] === move[1]))
              continue outer;
          }
        }

        unattacked_moves.push(move);
      }
    }

    return unattacked_moves;
  } else {
    // if its not a king
    const legalMoves = [];
    // get the current colors king
    const samePieceKing = teamPieces.find(p => p.piece_type[1] === "k");
    // go through each move
    for (const move of moves) {
      // duplicate the board and pieces
      let tempBoard = duplicateBoard(board);
      let dupePieces = dupePiecesArray(pieceArray);
        
      // temporarily move the piece to said location
      tempBoard[piece.location[0]][piece.location[1]] = "";
      const oldSpot = tempBoard[move[1]][move[0]];
      // if the old spot was occupied, remove the old piece from the dupped array
      if (oldSpot !== "")
        dupePieces.splice(dupePieces.findIndex(p => p.location[0] === move[1] && p.location[1] === move[0]), 1);
      // get new opponent pieces
      let newOppPieces = dupePieces.filter(p => p.color !== piece.color).filter(p => p.piece_type !== "k");
      // set the piece to the location
      tempBoard[move[1]][move[0]] = piece.piece_type;
      // if the king is not attacked push the move
      if (!kingAttacked(samePieceKing, newOppPieces, tempBoard, dupePieces))
        legalMoves.push(move);
    }
    return legalMoves;
  }
}