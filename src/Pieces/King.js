class King extends Piece {
  constructor(location, color) {
    super(location, color);
    this.piece_type = color + "k";
  }

  getMoves(board, otherPieces) {
    const moves = [];
    // all 8 possible default moves for the king
    const possibleMoves = [ [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1] ];

    // rooks positions (used for castling)
    const castleRooks = this.color === "w" ? [ [7, 0], [7, 7] ] : [ [0, 0], [0, 7] ];
    // gets actual rook objects
    const leftRook = otherPieces.find(v => v.startingLocation[0] === castleRooks[0][0] && v.startingLocation[1] === castleRooks[0][1]);
    const rightRook = otherPieces.find(v => v.startingLocation[0] === castleRooks[1][0] && v.startingLocation[1] === castleRooks[1][1]);

    // back rank of color, used for castling
    const row = this.color === "w" ? 7 : 0;

    // itterate through default moves
    for (const move of possibleMoves) {
      // get new cords
      const newCords = [this.location[1] + move[1], this.location[0] + move[0]];
      // get board location
      const boardLocation = board[newCords[1]]?.[newCords[0]];

      // if the board location exists
      if (boardLocation !== undefined) {
        // if the board location is same as current color, skip move
        if (boardLocation[0] === this.color) continue;
        // otherwise add it to array
        else if (boardLocation[0] !== this.color) 
          moves.push(newCords);
      }
    }

    // learned something new here, you can use labels on if statements and
    // use break statements to get out of if statements

    // you can only castle if you have not moved the king yet
    castleChecks: if (!this.has_moved) {
      // get opponent pieces
      const oppPieces = otherPieces.filter(p => p.color !== this.color).filter(p => p.piece_type[1] !== "k");
      // check if the king is being attacked in the current board position
      const attacked = kingAttacked(this, oppPieces, board, otherPieces);
      // if it is, break, you cant castle while in check
      if (attacked) break castleChecks;

      // queen side castling
      // if the left rook exists and hasn't moved
      if (leftRook && !leftRook.has_moved) {
        // get spaces in between the rook and king
        const spaces = [[row, 1], [row, 2], [row, 3]];
        let pieceInWay = false;
        // check each space and see if there is a piece in that location
        for (const space of spaces) {
          if (otherPieces.find(p => p.location[0] === space[0] && p.location[1] === space[1])) {
            pieceInWay = true;
            break;
          }
        }
        // if no piece in the way, add to moves
        if (!pieceInWay) moves.push("queen_side_castle");
      }

      // same check, but for king side castling (right side)
      if (rightRook && !rightRook.has_moved) {
        const spaces = [[row, 5], [row, 6]];
        let pieceInWay = false;
        for (const space of spaces) {
          if (otherPieces.find(p => p.location[0] === space[0] && p.location[1] === space[1])) {
            pieceInWay = true;
            break;
          }
        }
        if (!pieceInWay) moves.push("king_side_castle");
      }
    }
    return moves;
  }
}