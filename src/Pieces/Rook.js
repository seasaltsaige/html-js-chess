class Rook extends Piece {
  constructor(location, color) {
    super(location, color);
    this.piece_type = color + "r";
  }
  
  getMoves(board) {
    const moves = [];
    
    const distToEdges = [
      this.location[0],
      7 - this.location[1],
      7 - this.location[0],
      this.location[1]
    ];
    for (let d = 0; d < distToEdges.length; d++) {
      inner: for (let i = 1; i < distToEdges[d] + 1; i++) {
        let newCords;
        if (d === 0)
          newCords = [this.location[1], this.location[0] - i];
        else if (d === 1)
          newCords = [this.location[1] + i, this.location[0]];
        else if (d === 2)
          newCords = [this.location[1], this.location[0] + i];
        else if (d === 3)
          newCords = [this.location[1] - i, this.location[0]];

        if (board[newCords[1]][newCords[0]][0] === this.color) break inner
        moves.push(newCords);
        if (board[newCords[1]][newCords[0]] !== "" && board[newCords[1]][newCords[0]][0] !== this.color)
          break inner;
      }
    }

    return moves;
  }
}