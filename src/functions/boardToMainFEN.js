/**
 * Converts the current board array to a FEN string
 * @link https://www.chess.com/terms/fen-chess
 * @param {string[][]} board the active board 
 * @returns {string} 
 */
 function boardToFEN(board) {
  // this code was used in an older project, so i just had to convert
  // the current board (which uses things like wp and bp instead of P and p)
  const tboard = [];
  let t = 0;
  for (const row of board) {
    tboard.push([]);
    for (const col of row) {
      tboard[t].push(!col ? " " : col[0] === "b" ? col[1] : col[1].toUpperCase());
    }
    t++;
  }

  // valid pieces
  const pieces = "rRnNbBqQkKpP";
  // fen string to return
  let string = "";
  // itterate through the entire board
  for (let i = 0; i < tboard.length; i++) {
    for (let j = 0; j < tboard[i].length; j++) {
      // if the piece is a valid piece, add it to the string
      if (pieces.includes(tboard[i][j])) string += tboard[i][j];
      // otherwise add a 1 (indicating a space)
      else if (tboard[i][j] === " ") string += "1";
      // if we get to the end of a row, add a /, indicating the next row
      if (j === tboard.length - 1) string += "/";
    }
  }

  // find each list of 1's
  const regex = /(\d+)/g;
  const test = string.match(regex);
  if (test !== null)
    for (const s of test) {
      // replace them with their length
      string = string.replace(s, s.length.toString());
    }

  string = string.slice(0, string.length - 1);
  return string;
}