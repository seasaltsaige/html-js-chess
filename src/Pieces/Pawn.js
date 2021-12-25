
class Pawn extends Piece {
  constructor(location, color) {
    super(location, color);
    this.piece_type = color + "p";
  }

  getMoves(board, _, enPassant) {
    const moves = [];
    const x = this.location[1];
    const y = this.location[0];

    const nextSquare = y + (1 * this.moveMulti);

    if (board[nextSquare]?.[x] === "") {
      moves.push([x, nextSquare]);
      if (!this.has_moved) {
      const secondSquare = y + (2 * this.moveMulti);
        if (board[secondSquare]?.[x] === "") moves.push([x, secondSquare]);
      }
    }
    const right = board[y + (1*this.moveMulti)]?.[x + 1]?.slice(0, 1);
    const left = board[y + (1*this.moveMulti)]?.[x - 1]?.slice(0, 1)
    if (right && this.color !== right && right !== "")
      moves.push([x + 1, y + (1*this.moveMulti)]);
    if (left && this.color !== left && left !== "")
      moves.push([x - 1, y + (1*this.moveMulti)]);

    if (enPassant && enPassant !== "-") {
      const enPassantPosition = fenToPosition(enPassant);
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