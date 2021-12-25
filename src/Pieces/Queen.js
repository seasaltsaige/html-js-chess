class Queen extends Piece {
  constructor(location, color) {
    super(location, color);
    this.piece_type = color + "q";
  }
  
  getMoves(board) {
    const tempRook = new Rook(this.location, this.color);
    const tempBishop = new Bishop(this.location, this.color);
    const moves = tempRook.getMoves(board).concat(tempBishop.getMoves(board));
    return moves;
  }
}