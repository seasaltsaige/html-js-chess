/**
 * converts board cordinates to a FEN string
 * @param {[number, number]} cords cords to convert
 * @example const example = cordsToString([3, 5]);
 * console.log(example); // Logs "e5"
 * @returns {string}
 */
function cordsToString(cords) {
  const letter = colMap[cords[1]]
  return `${letter}${8 - cords[0]}`;
}