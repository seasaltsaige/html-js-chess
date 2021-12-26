class Rook extends Piece {
  constructor(location, color) {
    super(location, color);
    this.piece_type = color + "r";
  }
  
  getMoves(board) {
    const moves = [];
    
    // distance from each edge
    // [0] = dist to top
    // [1] = dist to right
    // [2] = dist to bottom
    // [3] = dist to left
    const distToEdges = [
      this.location[0],
      7 - this.location[1],
      7 - this.location[0],
      this.location[1]
    ];
    // itterate through each direction
    for (let d = 0; d < distToEdges.length; d++) {
      // count up to the distance (starting from 1 so it doesnt start)
      // on the current position
      inner: for (let i = 1; i < distToEdges[d] + 1; i++) {
        let newCords;
        // depending on which direction is currently active
        // create new cords
        if (d === 0)
          newCords = [this.location[1], this.location[0] - i];
        else if (d === 1)
          newCords = [this.location[1] + i, this.location[0]];
        else if (d === 2)
          newCords = [this.location[1], this.location[0] + i];
        else if (d === 3)
          newCords = [this.location[1] - i, this.location[0]];


        // if same color piece is reached stop the current direction
        if (board[newCords[1]][newCords[0]][0] === this.color) break inner
        // add piece to array
        moves.push(newCords);
        // if other color is reached, after move is added, stop the 
        // current direction
        if (board[newCords[1]][newCords[0]] !== "" && board[newCords[1]][newCords[0]][0] !== this.color)
          break inner;
      }
    }

    return moves;
  }
}