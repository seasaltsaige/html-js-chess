class Bishop extends Piece {
  constructor(location, color) {
    super(location, color);
    this.piece_type = color + "b";
  }
  
  getMoves(board) {
    const moveTypes = [ [-1, 1], [1, 1], [1, -1], [-1, -1] ];
    const moves = [];
    for (const move of moveTypes) {
      let i = 1;
      while (true) {
        const newMove = [this.location[1] + (move[1] * i), this.location[0] + (move[0] * i)];
        const boardLocation = board[newMove[1]]?.[newMove[0]];
        if (boardLocation !== undefined) {
          if (boardLocation[0] === this.color) break;
          else if (boardLocation[0] !== this.color && boardLocation !== "") {
            moves.push(newMove);
            break;
          } else moves.push(newMove);
        } else break;
        i++;
      }
    }
    
    return moves;
  }
}