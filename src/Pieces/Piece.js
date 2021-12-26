
/**
 * The basic unspecified piece, this is used to build all
 * the other pieces from.
 */
class Piece {
  /**
   * the current location of the piece in board cords [y, x]
   * @type {[number, number]}
   */
  location;
  // if the piece has moved
  has_moved = false;
  /**
   * the color of the piece
   * @type {"w" | "b"}
   */
  color;
  // only used for pawns really, so they move in the correct dirrection
  moveMulti;
  // actual piece type (ie: wp = White Pawn, or bk = Black King)
  piece_type;
  /**
   * The initial position of the piece
   * @type {[number, number]}
   */
  startingLocation;

  /**
   * @param {[number, number]} location 
   * @param {"b" | "w"} color 
   */
  constructor(location, color) {
    this.location = location;
    this.color = color;
    this.moveMulti = this.color === "b" ? 1 : -1;
    this.startingLocation = location;
  }

  /**
   * @param {string[][]} board the board context in array form
   * @param {Piece[]} otherPieces the array of other pieces in the game
   * @param {string} enPassant en passant square if applicable (really only used in pawns)
   * @returns {[number, number][]}
   */
  getMoves(board, otherPieces, enPassant) {};
}