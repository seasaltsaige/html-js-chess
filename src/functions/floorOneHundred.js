/**
 * Floors a given number to the next lowest 100
 * @param {number} number number to floor to the lowest 100 
 * @example const number = floor100(157);
 * console.log(number); // Logs 100
 * @returns {number}
 */
function floor100(number) {
  return Math.floor(number / 100) * 100;
}