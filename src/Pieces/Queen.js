class Queen extends Piece {
  constructor(location, color) {
    super(location, color);
    this.piece_type = color + "q";
  }
  
  getMoves(board) {
    // very simple, the queen moves like a rook and bishop combined
    // just use the moves from a rook and bishop in the same
    // position
    const tempRook = new Rook(this.location, this.color);
    const tempBishop = new Bishop(this.location, this.color);
    const moves = tempRook.getMoves(board).concat(tempBishop.getMoves(board));
    return moves;
  }
}