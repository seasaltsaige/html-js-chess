/**
 * @param {string} fen 
 * @returns {[number, number]}
 */
 function fenToPosition(fen) {
  if (!fen) return null;
  const parts = fen.split("");
  const letter = parts[0];
  const num = parts[1];

  const x = colMap.indexOf(letter)
  const y = 8 - parseInt(num);
  return [y, x];
}