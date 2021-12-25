/**
 * @param {[number, number]} cords 
 */
 function cordsToString(cords) {
  const letter = colMap[cords[1]]
  return `${letter}${8 - cords[0]}`;
}