class King extends Piece {
  constructor(location, color) {
    super(location, color);
    this.piece_type = color + "k";
  }

  getMoves(board, otherPieces) {
    const moves = [];
    const possibleMoves = [ [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1] ];

    const castleRooks = this.color === "w" ? [ [7, 0], [7, 7] ] : [ [0, 0], [0, 7] ];
    const leftRook = otherPieces.find(v => v.startingLocation[0] === castleRooks[0][0] && v.startingLocation[1] === castleRooks[0][1]);
    const rightRook = otherPieces.find(v => v.startingLocation[0] === castleRooks[1][0] && v.startingLocation[1] === castleRooks[1][1]);

    const row = this.color === "w" ? 7 : 0;
    for (const move of possibleMoves) {
      const newCords = [this.location[1] + move[1], this.location[0] + move[0]];
      const boardLocation = board[newCords[1]]?.[newCords[0]];

      if (boardLocation !== undefined) {
        if (boardLocation[0] === this.color) continue;
        else if (boardLocation[0] !== this.color) 
          moves.push(newCords);
      }
    }
    castleChecks: if (!this.has_moved) {
      const oppPieces = otherPieces.filter(p => p.color !== this.color).filter(p => p.piece_type[1] !== "k");
      const attacked = kingAttacked(this, oppPieces, board, otherPieces);
      if (attacked) break castleChecks;

      if (leftRook && !leftRook.has_moved) {
        const spaces = [[row, 1], [row, 2], [row, 3]];
        let pieceInWay = false;
        for (const space of spaces) {
          if (otherPieces.find(p => p.location[0] === space[0] && p.location[1] === space[1])) {
            pieceInWay = true;
            break;
          }
        }
        if (!pieceInWay) moves.push("queen_side_castle");
      }

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