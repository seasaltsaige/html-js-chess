/**
 * @param {string[][]} board
 * @returns {string} 
 */
 function boardToFEN(board) {
  const tboard = [];
  let t = 0;
  for (const row of board) {
    tboard.push([]);
    for (const col of row) {
      tboard[t].push(!col ? " " : col[0] === "b" ? col[1] : col[1].toUpperCase());
    }
    t++;
  }
  const pieces = "rRnNbBqQkKpP";
  let string = "";
  for (let i = 0; i < tboard.length; i++) {
    for (let j = 0; j < tboard[i].length; j++) {
      if (pieces.includes(tboard[i][j])) string += tboard[i][j];
      else if (tboard[i][j] === " ") string += "1";
      
      if (j === tboard.length - 1) string += "/";
    }
  }

  const regex = /(\d+)/g;
  const test = string.match(regex);
  if (test !== null)
    for (const s of test) {
      string = string.replace(s, s.length.toString());
    }

  string = string.slice(0, string.length - 1);
  return string;
}