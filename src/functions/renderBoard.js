/**
 * Render the board on the canvas with provided board position
 * @param {string[][]} board the current board position
 * @param {CanvasRenderingContext2D} ctx canvas rendering context
 * @param {{}} pieceMap map of piece images (just an object because im lazy)
 * @param {[number, number]} selectedPieceCords
 */
function renderBoard(board, ctx, pieceMap, selectedPieceCords) {
  // draw base board
  const image = document.getElementById("board");
  ctx.drawImage(image, 0, 0, boardSize, boardSize);

  // draw cordinates on board
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.font = "25px arial";
  ctx.fillText("a", 85, 793);
  ctx.fillText("c", 285, 793);
  ctx.fillText("e", 485, 793);
  ctx.fillText("g", 685, 793);
  ctx.fillText("7", 12, 127);
  ctx.fillText("5", 12, 327);
  ctx.fillText("3", 12, 527);
  ctx.fillText("1", 12, 727);

  ctx.font = "25px arial";
  ctx.fillStyle = "#33694C";
  ctx.fillText("b", 185, 793);
  ctx.fillText("d", 385, 793);
  ctx.fillText("f", 585, 793);
  ctx.fillText("h", 785, 793);
  ctx.fillText("8", 12, 27);
  ctx.fillText("6", 12, 227);
  ctx.fillText("4", 12, 427);
  ctx.fillText("2", 12, 627);

  // go through each board position
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      // if the board has a piece
      if (board[row][col] !== "") {
        // if there is a selected piece and we are at that position
        if (selectedPieceCords !== null && row === selectedPieceCords[0] && col === selectedPieceCords[1]) {
          // fill a faint yellow square to indicate it being selected
          ctx.fillStyle = "#f6ff0035";
          ctx.fillRect(col * pieceSize, row * pieceSize, pieceSize, pieceSize);
        }
        // finally draw the piece in the correct location
        ctx.drawImage(pieceMap[board[row][col]], col*pieceSize, row*pieceSize, pieceSize, pieceSize);
      }
    }
  }
}