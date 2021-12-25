class Knight extends Piece {
  constructor(location, color) {
    super(location, color);
    this.piece_type = color + "n";
  }
  
  getMoves(board) {
    const moves = [];
    const arrOfMoves = [ [-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1] ];
    for (const move of arrOfMoves) {
      const newCords = [this.location[0] + move[0], this.location[1] + move[1]];
      if (newCords[0] < 8 && newCords[0] >= 0 && newCords[1] < 8 && newCords[1] >= 0) {
        if (this.color !== board[newCords[0]][newCords[1]].slice(0, 1))
          moves.push([newCords[1], newCords[0]]);
      };
    }
    return moves;
  }
}