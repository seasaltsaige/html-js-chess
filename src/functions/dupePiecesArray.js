/**
 * @param {Piece[]} pieces 
 * @returns {Piece[]}
 */
 function dupePiecesArray(pieces) {
  const p = [];

  for (const piece of pieces)
    p.push(piece);

  return p;
}