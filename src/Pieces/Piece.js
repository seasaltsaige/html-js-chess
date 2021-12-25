class Piece {
  /**
   * @type {[number, number]}
   */
  location;
  has_moved = false;
  color;
  moveMulti;
  piece_type;
  /**
   * @type {[number, number]}
   */
  startingLocation;

  constructor(location, color) {
    this.location = location;
    this.color = color;
    this.moveMulti = this.color === "b" ? 1 : -1;
    this.startingLocation = location;
  }

  /**
   * @param {[number, number]} location
   */
  set location(location) {
    this.location = location;
  }

  /**
   * @param {string[][]} board 
   * @param {Piece[]} otherPieces
   * @param {string} enPassant
   * @returns {[number, number][]}
   */
  getMoves(board, otherPieces, enPassant) {};
  /**
   * @param {boolean} new_val
   */
  set has_moved(new_val) {
    this.has_moved = new_val;
  }
}