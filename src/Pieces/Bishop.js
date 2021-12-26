class Bishop extends Piece {
  constructor(location, color) {
    super(location, color);
    this.piece_type = color + "b";
  }
  
  getMoves(board) {
    // different directions the bishop can move
    // [-1, 1] = Up Right diagonal
    // [1, 1] = Down Right diagonal
    // [1, -1] = Down Left diagonal
    // [-1, -1] = Up Left diagonal
    const moveTypes = [ [-1, 1], [1, 1], [1, -1], [-1, -1] ];
    const moves = [];
    // each move type
    for (const move of moveTypes) {
      let i = 1;
      while (true) {
        // continue checking 1 more on the diagonal
        const newMove = [this.location[1] + (move[1] * i), this.location[0] + (move[0] * i)];
        // get the board location
        const boardLocation = board[newMove[1]]?.[newMove[0]];
        // if its a valid square continue
        if (boardLocation !== undefined) {
          // if the board location has the same color piece, stop
          if (boardLocation[0] === this.color) break;
          // if its the other color piece, add it to the moves, then stop
          else if (boardLocation[0] !== this.color && boardLocation !== "") {
            moves.push(newMove);
            break;
            // otherwise just normally add the move
          } else moves.push(newMove);
          // otherwise stop itterating and continue to the next diagonal
        } else break;
        i++;
      }
    }
    
    return moves;
  }
}