
class Pawn extends Piece {
  constructor(location, color) {
    super(location, color);
    this.piece_type = color + "p";
  }

  getMoves(board, _, enPassant) {
    const moves = [];
    const x = this.location[1];
    const y = this.location[0];

    // next square forward y position
    const nextSquare = y + (1 * this.moveMulti);

    // if its an empty space
    if (board[nextSquare]?.[x] === "") {
      // add it to the array
      moves.push([x, nextSquare]);
      // if the pawn hasnt moved
      if (!this.has_moved) {
        // get the next square forward (2 forward now)
        const secondSquare = y + (2 * this.moveMulti);
        // if its an empty square, add it to the array
        if (board[secondSquare]?.[x] === "") moves.push([x, secondSquare]);
      }
    }
    // take moves
    // get the square to the right and left diagonal of the pawn
    const right = board[y + (1*this.moveMulti)]?.[x + 1]?.slice(0, 1);
    const left = board[y + (1*this.moveMulti)]?.[x - 1]?.slice(0, 1)
    // if the square is of the other color and not an empty string
    // add the move to the array
    if (right && this.color !== right && right !== "")
      moves.push([x + 1, y + (1*this.moveMulti)]);
    if (left && this.color !== left && left !== "")
      moves.push([x - 1, y + (1*this.moveMulti)]);

    // if enPassant is not "-" (indicating no enpassant square)
    if (enPassant && enPassant !== "-") {
      // get the cords from the fen 
      const enPassantPosition = fenToPosition(enPassant);
      // depending on color, if the current pawn (this) is at a diagonal from
      // the valid en passant square, add the move to the array
      if (this.color === "w") {
        if ((this.location[0] === enPassantPosition[0] + 1 && this.location[1] === enPassantPosition[1] - 1) || (this.location[0] === enPassantPosition[0] + 1 && this.location[1] === enPassantPosition[1] + 1))
          moves.push([enPassantPosition[1], enPassantPosition[0]]);
      } else if (this.color === "b") {
        if ((this.location[0] === enPassantPosition[0] - 1 && this.location[1] === enPassantPosition[1] - 1) || (this.location[0] === enPassantPosition[0] - 1 && this.location[1] === enPassantPosition[1] + 1))
          moves.push([enPassantPosition[1], enPassantPosition[0]]);
      }
    }

    return moves;
  }
}