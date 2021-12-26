/**
 * converts from a single fen string (algebraic notation) to board cords [y, x]
 * @param {string} fen individual fen position (e5) 
 * @returns {[number, number]}
 */
 function fenToPosition(fen) {
  if (!fen) return null;
  // get parts
  const parts = fen.split("");
  const letter = parts[0];
  const num = parts[1];

  // index of letter = x pos
  const x = colMap.indexOf(letter)
  // get y pos
  const y = 8 - parseInt(num);
  return [y, x];
}