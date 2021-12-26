/**
 * create a new array of pieces
 * @param {Piece[]} pieces old pieces array
 * @returns {Piece[]}
 */
function dupePiecesArray(pieces) {
  const p = [];

  for (const piece of pieces)
    p.push(piece);

  return p;
}