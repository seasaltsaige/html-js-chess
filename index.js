const boardSize = 800;
const pieceSize = boardSize / 8;

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
}

class Piece {
  /**
   * @type {[number, number]}
   */
  location;
  has_moved = false;
  color;
  moveMulti;
  piece_type;
  /**
   * @type {[number, number]}
   */
  startingLocation;

  constructor(location, color) {
    this.location = location;
    this.color = color;
    this.moveMulti = this.color === "b" ? 1 : -1;
    this.startingLocation = location;
  }

  /**
   * @param {[number, number]} location
   */
  set location(location) {
    this.location = location;
  }

  /**
   * @param {string[][]} board 
   * @param {Piece[]} otherPieces
   * @returns {[number, number][]}
   */
  getMoves(board, otherPieces) {};
  /**
   * @param {boolean} new_val
   */
  set has_moved(new_val) {
    this.has_moved = new_val;
  }
}

class Pawn extends Piece {
  constructor(location, color) {
    super(location, color);
    this.piece_type = color + "p";
  }

  getMoves(board) {
    const moves = [];
    const x = this.location[1];
    const y = this.location[0];

    const nextSquare = y + (1 * this.moveMulti);

    if (board[nextSquare]?.[x] === "") {
      moves.push([x, nextSquare]);
      if (!this.has_moved) {
      const secondSquare = y + (2 * this.moveMulti);
        if (board[secondSquare]?.[x] === "") moves.push([x, secondSquare]);
      }
    }
    const right = board[y + (1*this.moveMulti)]?.[x + 1]?.slice(0, 1);
    const left = board[y + (1*this.moveMulti)]?.[x - 1]?.slice(0, 1)
    if (right && this.color !== right && right !== "")
      moves.push([x + 1, y + (1*this.moveMulti)]);
    if (left && this.color !== left && left !== "")
      moves.push([x - 1, y + (1*this.moveMulti)]);

    return moves;
  }
}

class Rook extends Piece {
  constructor(location, color) {
    super(location, color);
    this.piece_type = color + "r";
  }
  
  getMoves(board) {
    const moves = [];
    
    const distToEdges = [
      this.location[0],
      7 - this.location[1],
      7 - this.location[0],
      this.location[1]
    ];
    for (let d = 0; d < distToEdges.length; d++) {
      inner: for (let i = 1; i < distToEdges[d] + 1; i++) {
        let newCords;
        if (d === 0)
          newCords = [this.location[1], this.location[0] - i];
        else if (d === 1)
          newCords = [this.location[1] + i, this.location[0]];
        else if (d === 2)
          newCords = [this.location[1], this.location[0] + i];
        else if (d === 3)
          newCords = [this.location[1] - i, this.location[0]];

        if (board[newCords[1]][newCords[0]][0] === this.color) break inner
        moves.push(newCords);
        if (board[newCords[1]][newCords[0]] !== "" && board[newCords[1]][newCords[0]][0] !== this.color)
          break inner;
      }
    }

    return moves;
  }
}

class Knight extends Piece {
  constructor(location, color) {
    super(location, color);
    this.piece_type = color + "n";
  }
  
  getMoves(board) {
    const moves = [];
    const arrOfMoves = [ [-2, 1], [-1, 2], [1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1] ];
    for (const move of arrOfMoves) {
      const newCords = [this.location[0] + move[0], this.location[1] + move[1]];
      if (newCords[0] < 8 && newCords[0] >= 0 && newCords[1] < 8 && newCords[1] >= 0) {
        if (this.color !== board[newCords[0]][newCords[1]].slice(0, 1))
          moves.push([newCords[1], newCords[0]]);
      };
    }
    return moves;
  }
};
class Bishop extends Piece {
  constructor(location, color) {
    super(location, color);
    this.piece_type = color + "b";
  }
  
  getMoves(board) {
    const moveTypes = [ [-1, 1], [1, 1], [1, -1], [-1, -1] ];
    const moves = [];
    for (const move of moveTypes) {
      let i = 1;
      while (true) {
        const newMove = [this.location[1] + (move[1] * i), this.location[0] + (move[0] * i)];
        const boardLocation = board[newMove[1]]?.[newMove[0]];
        if (boardLocation !== undefined) {
          if (boardLocation[0] === this.color) break;
          else if (boardLocation[0] !== this.color && boardLocation !== "") {
            moves.push(newMove);
            break;
          } else moves.push(newMove);
        } else break;
        i++;
      }
    }
    
    return moves;
  }
};
class Queen extends Piece {
  constructor(location, color) {
    super(location, color);
    this.piece_type = color + "q";
  }
  
  getMoves(board) {
    const tempRook = new Rook(this.location, this.color);
    const tempBishop = new Bishop(this.location, this.color);
    
    const moves = tempRook.getMoves(board).concat(tempBishop.getMoves(board));
    return moves;
  }
};
class King extends Piece {
  constructor(location, color) {
    super(location, color);
    this.piece_type = color + "k";
  }
  
  /**
   * 
   * @param {string[][]} board 
   * @param {Piece[]} otherPieces 
   * @returns {void}
   */
  getMoves(board, otherPieces) {
    const moves = [];
    const possibleMoves = [ [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1] ];

    const castleRooks = this.color === "w" ? [ [7, 0], [7, 7] ] : [ [0, 0], [0, 7] ];
    const leftRook = otherPieces.find(v => v.startingLocation[0] === castleRooks[0][0] && v.startingLocation[1] === castleRooks[0][1]);
    const rightRook = otherPieces.find(v => v.startingLocation[0] === castleRooks[1][0] && v.startingLocation[1] === castleRooks[1][1]);

    const row = this.color === "w" ? 7 : 0;
    for (const move of possibleMoves) {
      const newCords = [this.location[1] + move[1], this.location[0] + move[0]];
      const boardLocation = board[newCords[1]]?.[newCords[0]];

      if (boardLocation !== undefined) {
        if (boardLocation[0] === this.color) continue;
        else if (boardLocation[0] !== this.color) 
          moves.push(newCords);
      }
    }
    castleChecks: if (!this.has_moved) {
      const oppPieces = otherPieces.filter(p => p.color !== this.color).filter(p => p.piece_type[1] !== "k");
      const attacked = kingAttacked(this, oppPieces, board, otherPieces);
      if (attacked) break castleChecks;

      if (leftRook && !leftRook.has_moved) {
        const spaces = [[row, 1], [row, 2], [row, 3]];
        let pieceInWay = false;
        for (const space of spaces) {
          if (otherPieces.find(p => p.location[0] === space[0] && p.location[1] === space[1])) {
            pieceInWay = true;
            break;
          }
        }
        if (!pieceInWay) moves.push("queen_side_castle");
      }

      if (rightRook && !rightRook.has_moved) {
        const spaces = [[row, 5], [row, 6]];
        let pieceInWay = false;
        for (const space of spaces) {
          if (otherPieces.find(p => p.location[0] === space[0] && p.location[1] === space[1])) {
            pieceInWay = true;
            break;
          }
        }
        if (!pieceInWay) moves.push("king_side_castle");
      }
    }
    return moves;
  }
};

let selectedPiece = null;

// START GAME LOGIC

const colMap = ["a", "b", "c", "d", "e", "f", "g", "h"];

window.onload = async () => {
  let moveNumber = 1;
  let startFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
  let pgnString = 
  `${moveNumber}. `;

  const startGame = document.getElementById("start");
  startGame.play();

  const castleSound = document.getElementById("castle");
  const moveSound = document.getElementById("moveAudio");
  const takeSound = document.getElementById("capture");
  const checkSound = document.getElementById("check");
  const checkmateSound = document.getElementById("checkmate");
  const fenButton = document.getElementById("fen");
  const pgnButton = document.getElementById("pgn");

  const pawnPromotionBoard = document.getElementById("promote");
  
  const canvas = document.getElementById("canvas");
  canvas.width = boardSize;
  canvas.height = boardSize;

  const secondaryCanvas = document.getElementById("pawn");
  secondaryCanvas.width = boardSize;
  secondaryCanvas.height = boardSize;

  const board = fillBoard(startFEN);
  const pieceMap = {
    bp: document.getElementById("bp"),
    br: document.getElementById("br"),
    bn: document.getElementById("bn"),
    bb: document.getElementById("bb"),
    bk: document.getElementById("bk"),
    bq: document.getElementById("bq"),

    wp: document.getElementById("wp"),
    wr: document.getElementById("wr"),
    wn: document.getElementById("wn"),
    wb: document.getElementById("wb"),
    wk: document.getElementById("wk"),
    wq: document.getElementById("wq"),
  }

  const classMap = {
    p: Pawn,
    r: Rook,
    b: Bishop,
    n: Knight,
    q: Queen,
    k: King,
  };

  fenButton.onclick = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    const fen = boardToFEN(board);
    navigator.clipboard.writeText(fen);
  }

  pgnButton.onclick = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    navigator.clipboard.writeText(pgnString);
  }

  /**
   * @type {Piece[]}
   */
  const pieceArray = [];

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = classMap[board[row][col][1]];
      if (piece)
        pieceArray.push(new piece([row, col], board[row][col][0] === "b" ? "b" : "w"));
    }
  }

  const move = document.getElementById("move");
  const take = document.getElementById("take");
  /**
   * @type {CanvasRenderingContext2D}
   */
  const ctx = canvas.getContext("2d");
  /**
   * @type {CanvasRenderingContext2D}
   */
  const ctx2 = secondaryCanvas.getContext("2d");
  renderBoard(board, ctx, pieceMap, null);
  let turn = "w";
  window.onclick = clickEventFN;
  function clickEventFN (event) {
    const cords = getCursorPosition(canvas, event).reverse().map(v => Math.floor(v / 100));

    if (selectedPiece) {
      const moves = filterLegalMoves(selectedPiece, board, pieceArray)// selectedPiece.getMoves(board, pieceArray);
      if (moves.find(v => typeof v === "string")) {

        const correct_row = selectedPiece.color === "w" ? 7 : 0;
        const castle_squares = [[correct_row, 2], [correct_row, 6]]; // qs, ks

        if (cords[0] === castle_squares[0][0] && cords[1] === castle_squares[0][1] && !moves.includes("queen_side_castle"))
          return;
        else if (cords[0] === castle_squares[1][0] && cords[1] === castle_squares[1][1] && !moves.includes("king_side_castle"))
          return;

        let trying_to_castle = true;
        if (!(cords[0] === castle_squares[0][0] && cords[1] === castle_squares[0][1]) && !(cords[0] === castle_squares[1][0] && cords[1] === castle_squares[1][1])) 
          trying_to_castle = false;

        if (trying_to_castle) {
          const rook_col = cords[1] === 2 && cords[0] === correct_row ? 0 
          : cords[1] === 6 && cords[0] === correct_row ? 7 
          : -1;
          const rook = pieceArray.find(p => p.location[0] === correct_row && p.location[1] === rook_col);
          if (rook) {
            const newRookPos = [correct_row, cords[1] === 2 ? 3 : 5];
            const newKingPos = [correct_row, cords[1]];

            board[rook.location[0]][rook.location[1]] = "";
            board[newRookPos[0]][newRookPos[1]] = rook.piece_type;
            board[selectedPiece.location[0]][selectedPiece.location[1]] = "";
            board[newKingPos[0]][newKingPos[1]] = selectedPiece.piece_type;
            
            selectedPiece.location = newKingPos;
            rook.location = newRookPos;
            selectedPiece.has_moved = true;
            rook.has_moved = true;

            selectedPiece = null;
            renderBoard(board, ctx, pieceMap, null);
            castleSound.play();
            console.log(rook_col, correct_row);
            if (rook_col === 7) pgnString += "O-O ";
            else if (rook_col === 0) pgnString += "O-O-O ";

            turn = turn === "w" ? "b" : "w";

            if (turn === "w") {
              moveNumber++;
              pgnString += `${moveNumber}. `;
            } 

          }
        } else {
          if (moves.find(v => v[0] === cords[1] && v[1] === cords[0])) {
            let tookPiece = false;
            if (board[cords[0]][cords[1]][0] !== selectedPiece.color && board[cords[0]][cords[1]] !== "")  {
              pieceArray.splice(pieceArray.findIndex(v => v.location[0] === cords[0] && v.location[1] === cords[1]), 1);
              tookPiece = true;
            }

            const oldPos = selectedPiece.location;
            selectedPiece.location = cords;
            selectedPiece.has_moved = true;
            board[cords[0]][cords[1]] = selectedPiece.piece_type;
            const oldPieceBoard = board[oldPos[0]][oldPos[1]];
            board[oldPos[0]][oldPos[1]] = "";
            
            selectedPiece = null;
            renderBoard(board, ctx, pieceMap, null);
    
            const pieceForPGNTooken = oldPieceBoard[1].toUpperCase();
            const cordsAsString = cordsToString(cords);
            if (tookPiece) {
              takeSound.play();
              pgnString += `${pieceForPGNTooken}x${cordsAsString}`; 
            } else {
              moveSound.play();
              pgnString += `${pieceForPGNTooken}${cordsAsString}`;
            }

            turn = turn === "w" ? "b" : "w";

            if (turn === "w") {
              moveNumber++;
              pgnString += `${moveNumber}. `;
            } 
          } else {
            selectedPiece = null;
            renderBoard(board, ctx, pieceMap, null);
          }       
        }

      } else if (moves.find(v => v[0] === cords[1] && v[1] === cords[0])) {
        let tookPiece = false;
        if (board[cords[0]][cords[1]][0] !== selectedPiece.color && board[cords[0]][cords[1]] !== "")  {
          pieceArray.splice(pieceArray.findIndex(v => v.location[0] === cords[0] && v.location[1] === cords[1]), 1);
          tookPiece = true;
        }

        const oldPos = selectedPiece.location;
        selectedPiece.location = cords;
        selectedPiece.has_moved = true;
        board[cords[0]][cords[1]] = selectedPiece.piece_type;
        board[oldPos[0]][oldPos[1]] = "";

        const opponentKing = pieceArray.find(p => p.piece_type[1] === "k" && p.color !== turn);
        const oppKingAttacked = kingAttacked(opponentKing, pieceArray.filter(p => p.color === turn).filter(p => p.piece_type[1] !== "k"), board, pieceArray);

        let isPromotion = false;

        if (selectedPiece.piece_type[1] === "p") {
          if ((selectedPiece.color === "w" && selectedPiece.location[0] === 0) || (selectedPiece.color === "b" && selectedPiece.location[0] === 7))  {
            isPromotion = true;
            ctx2.drawImage(pawnPromotionBoard, canvas.width/2 - 200, canvas.height/2 - 50, 400, 100);
            ctx2.rect(canvas.width/2 - 200, canvas.height/2 - 50, 400, 100);
            ctx2.textAlign = "center";
            ctx2.font = "50px bold arial";
            ctx2.fillStyle = "black";
            ctx2.fillText("Choose a piece to promote to", canvas.width/2, canvas.height/2-70);
            ctx2.drawImage(pieceMap[turn + "r"], canvas.width/2-200, canvas.width/2-50, pieceSize, pieceSize);
            ctx2.drawImage(pieceMap[turn + "n"], canvas.width/2-100, canvas.height/2-50, pieceSize, pieceSize);
            ctx2.drawImage(pieceMap[turn + "b"], canvas.width/2, canvas.width/2-50, pieceSize, pieceSize);
            ctx2.drawImage(pieceMap[turn + "q"], canvas.width/2+100, canvas.height/2-50, pieceSize, pieceSize);
            ctx2.lineWidth = 5;
            ctx2.stroke();

            const pawn = selectedPiece;
            let pts = null;

            window.onclick = (ev) => {
              const [x, y] = getCursorPosition(canvas, ev);

              const yRange = [350, 450];
              const rookX = [200, 300];
              const knightX = [300, 400];
              const bishopX = [400, 500];
              const queenX = [500, 600];

              if (y >= yRange[0] && y <= yRange[1]) {
                /**
                 * @type {Rook | Knight | Bishop | Queen}
                 */
                if (x >= rookX[0] && x < rookX[1])
                  pts = Rook;
                else if (x >= knightX[0] && x < knightX[1])
                  pts = Knight;
                else if (x >= bishopX[0] && x < bishopX[1])
                  pts = Bishop;
                else if (x >= queenX[0] && x < queenX[1])
                  pts = Queen;
                else pts = null;

                if (pts !== null) {
                  const piece = new pts(pawn.location, pawn.color);
                  piece.startingLocation = pawn.startingLocation;
                  pieceArray.splice(pieceArray.findIndex(v => v.location[0] === pawn.location[0] && v.location[1] === pawn.location[1]), 1);
                  pieceArray.push(piece);
                  board[piece.location[0]][piece.location[1]] = piece.piece_type;
                  renderBoard(board, ctx, pieceMap, null);
                  ctx2.clearRect(0, 0, secondaryCanvas.width, secondaryCanvas.height);
                  const isCheck = kingAttacked(opponentKing, pieceArray.filter(p => p.color === piece.color), board, pieceArray);
                  const isCheckMate = checkmate(opponentKing, board, pieceArray);
                  const fenStr = cordsToString(cords);
                  const oldFen = cordsToString(oldPos);

                  if (isCheckMate) {
                    if (tookPiece) {
                      pgnString += `${oldFen[0]}x${fenStr}=${piece.piece_type[1].toUpperCase()}# ${turn === "w" ? "1-0" : "0-1"}`;
                    } else {
                      pgnString += `${fenStr}=${piece.piece_type[1].toUpperCase()}# ${turn === "w" ? "1-0" : "0-1"}`;
                    }

                    window.onclick = () => {};
                    checkmateSound.play();

                    ctx.fillStyle = "rgb(31, 32, 43)";
                    ctx.font = "50px bold arial";
                    const { width: textWidth } = ctx.measureText(`${turn === "w" ? "White" : "Black"} won due to checkmate!`);
                    
                    ctx.roundRect(canvas.width / 2 - (textWidth / 2) - 50, canvas.height/2 - 100, textWidth + 100, 170, 30);
                    ctx.fill();
                    ctx.fillStyle = "white";
                    ctx.fillText(`${turn === "w" ? "White" : "Black"} won due to checkmate!`, canvas.width/2, canvas.height/2);

                    return;
                    
                  } else if (isCheck) {

                    if (tookPiece) 
                      pgnString += `${oldFen[0]}x${fenStr}=${piece.piece_type[1].toUpperCase()}+ `;
                    else pgnString += `${fenStr}=${piece.piece_type[1].toUpperCase()}+ `;

                    checkSound.play();
                  } else if (tookPiece) {
                    pgnString += `${oldFen}[0]x${fenStr}=${piece.piece_type[1].toUpperCase()} `;
                    takeSound.play();
                  }

                  window.onclick = clickEventFN;
                  return;
                }
              }
            }
          }
        }

        const checkMate = checkmate(pieceArray.find(p => p.color !== selectedPiece.color && p.piece_type[1] === "k"), board, pieceArray);
        
        renderBoard(board, ctx, pieceMap, null);
        if (!isPromotion) {
          if (checkMate) {
            window.onclick = () => {};
            checkmateSound.play();
            ctx.fillStyle = "rgb(31, 32, 43)";
            ctx.font = "50px bold arial";
            const { width: textWidth } = ctx.measureText(`${turn === "w" ? "White" : "Black"} won due to checkmate!`);
            
            ctx.roundRect(canvas.width / 2 - (textWidth / 2) - 50, canvas.height/2 - 100, textWidth + 100, 170, 30);
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.fillText(`${turn === "w" ? "White" : "Black"} won due to checkmate!`, canvas.width/2, canvas.height/2);

            const pieceForPGN = selectedPiece.piece_type[1].toUpperCase();
            const fen = cordsToString(cords);
            const oldFen = cordsToString(oldPos);
            if (tookPiece) pgnString += `${pieceForPGN.toLowerCase() === "p" ? oldFen[0] : pieceForPGN}x${fen}# ${turn === "w" ? "1-0" : "0-1"}`;
            else pgnString += `${pieceForPGN.toLowerCase() === "p" ? "" : pieceForPGN}${fen}# ${turn === "w" ? "1-0" : "0-1"}`;

            pgnString = pgnString.replace("Result \"Unknown\"", `Result "${turn === "w" ? "1-0" : "0-1"}"`)
            navigator.clipboard.writeText(pgnString);

          } else if (oppKingAttacked) {
            checkSound.play();

            const pieceForPGN = selectedPiece.piece_type[1].toUpperCase();
            const fen = cordsToString(cords);
            const oldFen = cordsToString(oldPos);
            if (tookPiece) pgnString += `${pieceForPGN.toLowerCase() === "p" ? oldFen[0] : pieceForPGN}x${fen}+ `;
            else pgnString += `${pieceForPGN.toLowerCase() === "p" ? "" : pieceForPGN}${fen}+ `;
          } else if (tookPiece) {
            takeSound.play();
            const pieceForPGN = selectedPiece.piece_type[1].toUpperCase();
            const fen = cordsToString(cords);
            const oldFen = cordsToString(oldPos);
            pgnString += `${pieceForPGN.toLowerCase() === "p" ? oldFen[0] : pieceForPGN}x${fen} `;
          } else {
            const pieceForPGN = selectedPiece.piece_type[1].toUpperCase();
            const fen = cordsToString(cords);
            pgnString += `${pieceForPGN.toLowerCase() === "p" ? "" : pieceForPGN}${fen} `;
            moveSound.play();
          }
        }
        turn = turn === "w" ? "b" : "w";
        if (turn === "w") {
          moveNumber++;
          pgnString += `${moveNumber}. `;
        } 
      } else {
        selectedPiece = null;
        renderBoard(board, ctx, pieceMap, null);
      }     

      
      selectedPiece = null;
    } else {
      const pieceAtLocation = pieceArray.find(p => p.location[0] === cords[0] && p.location[1] === cords[1]);
      if (pieceAtLocation?.color !== turn) return;
      if (pieceAtLocation) { 
        selectedPiece = pieceAtLocation;
        const moves = filterLegalMoves(pieceAtLocation, board, pieceArray);
        renderBoard(board, ctx, pieceMap, pieceAtLocation.location);
        for (const m of moves) {
          if (typeof m === "string") {
            const row = pieceAtLocation.color === "w" ? 7 : 0;
            const col_to_highlight = m === "king_side_castle" ? 6 : 2;
            ctx.drawImage(move, col_to_highlight * pieceSize, row * pieceSize, pieceSize, pieceSize);
          } else {
            if (board[m[1]][m[0]] === "")
              ctx.drawImage(move, m[0] * pieceSize, m[1] * pieceSize, pieceSize, pieceSize);
            else
              ctx.drawImage(take, m[0] * pieceSize, m[1] * pieceSize, pieceSize, pieceSize);
          }
        }
      } else { 
        selectedPiece = null;
        renderBoard(board, ctx, pieceMap, null);
      }
    } 
  }
}
/**
 * 
 * @param  {[number, number]} param0 
 * @param {string[][]} board 
 * @returns {string}
 */
function cordsToBoardSquare(board, ...[x,y]) {
  const [xx,yy] = [floor100(x) / 100, floor100(y)/ 100];
  return board[yy][xx];
}

/**
 * 
 * @param {*} board 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {*} pieceMap 
 */
function renderBoard(board, ctx, pieceMap, selectedPieceCords) {
  const image = document.getElementById("board");
  ctx.drawImage(image, 0, 0, boardSize, boardSize);

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

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] !== "") {
        if (selectedPieceCords !== null && row === selectedPieceCords[0] && col === selectedPieceCords[1]) {
          ctx.fillStyle = "#f6ff0035";
          ctx.fillRect(col * pieceSize, row * pieceSize, pieceSize, pieceSize);
        }
        ctx.drawImage(pieceMap[board[row][col]], 
          col*pieceSize, 
          row*pieceSize, 
          pieceSize, 
          pieceSize);
      }
    }
  }

}

function floor100(number) {
  return Math.floor(number / 100) * 100;
}
/**
 * @param {string} fen 
 * @returns {string[][]}
 */
function fillBoard(fen) {
  const board = [[]];
  let row = 0;
  for (const l of fen) {
    if (isNaN(parseInt(l))) {
      if (l === "/") {
        row++;
        board.push([]);
        continue;
      } else if (l === l.toLowerCase()) {
        board[row].push(`b${l}`);
      } else if (l !== l.toLowerCase()) {
        board[row].push(`w${l.toLowerCase()}`);
      }
    } else {
      for (let i = 0; i < parseInt(l); i++) {
        board[row].push("");
      }
    }
  }
  return board;
}

function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return [x, y];
}

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

/**
 * @param {Piece} piece 
 * @param {string[][]} board
 * @param {Piece[]} pieceArray
 * @returns {[number, number][]}
 */
function filterLegalMoves(piece, board, pieceArray) {

  const whitePieces = pieceArray.filter(p => p.color === "w");
  const blackPieces = pieceArray.filter(p => p.color === "b");

  const opponentPieces = (piece.color === "w" ? blackPieces : whitePieces).filter(p => p.piece_type[1] !== "k");
  const teamPieces = piece.color === "w" ? whitePieces : blackPieces;
  let moves = piece.getMoves(board, pieceArray);
  if (piece.piece_type[1] === "k") {
    const unattacked_moves = [];

    const correct_row = piece.color === "w" ? 7 : 0;

    const qsbr = [
      [correct_row, 1], [correct_row, 2], [correct_row, 3],
    ];
    const ksbr = [
      [correct_row, 5], [correct_row, 6],
    ];

    outer: for (const move of moves) {
      if (typeof move === "string") {
        let squares = [];
        if (move === "king_side_castle") 
          squares = ksbr;
        else if (move === "queen_side_castle") 
          squares = qsbr;

        for (const otherPiece of opponentPieces) {
          const otherPieceMoves = otherPiece.getMoves(board, pieceArray);
          for (const s of squares) {
            for (const opMv of otherPieceMoves) {
              if (s[0] === opMv[1] && s[1] === opMv[0]) 
                continue outer;
            }
          }
        }
        unattacked_moves.push(move);
      } else {
        for (const otherPiece of opponentPieces) {

          if (otherPiece.piece_type[1] === "p") {
            const pawnMoves = otherPiece.getMoves(board, pieceArray);
            const correctMoves = pawnMoves.filter(m => m[1] !== move[1]);
            if (correctMoves.find(v => v[0] === move[0] && v[1] === move[1]))
              continue outer;
          } else {

            const pMoves = otherPiece.getMoves(board, pieceArray);
            if (pMoves.find(v => v[0] === move[0] && v[1] === move[1]))
              continue outer;
          }
        }

        unattacked_moves.push(move);
      }
    }


    const legalMoves = [];
    const kingActualPos = piece.location;

    for (const move of unattacked_moves) {
      if (typeof move === "string") {
        legalMoves.push(move);
        continue;
      }
      let tempBoard = duplicateBoard(board);
      let dupePieces = dupePiecesArray(pieceArray);
      tempBoard[kingActualPos[0]][kingActualPos[1]] = "";
      const oldSpot = tempBoard[move[1]][move[0]];

      if (oldSpot !== "")
        dupePieces.splice(dupePieces.findIndex(p => p.location[0] === move[1] && p.location[1] === move[0]), 1);

      let newOppPieces = dupePieces.filter(p => p.color !== piece.color).filter(p => p.piece_type !== "k");

      tempBoard[move[1]][move[0]] = piece.piece_type;
      piece.location = [move[1], move[0]];
      if (!kingAttacked(piece, newOppPieces, tempBoard, dupePieces))
        legalMoves.push(move);
    }

    piece.location = kingActualPos;

    return legalMoves;
  } else {
    const legalMoves = [];
    const samePieceKing = teamPieces.find(p => p.piece_type[1] === "k");
    for (const move of moves) {
      let tempBoard = duplicateBoard(board);
      let dupePieces = dupePiecesArray(pieceArray);
        
      tempBoard[piece.location[0]][piece.location[1]] = "";
      const oldSpot = tempBoard[move[1]][move[0]];
      if (oldSpot !== "")
        dupePieces.splice(dupePieces.findIndex(p => p.location[0] === move[1] && p.location[1] === move[0]), 1);

      let newOppPieces = dupePieces.filter(p => p.color !== piece.color).filter(p => p.piece_type !== "k");
      tempBoard[move[1]][move[0]] = piece.piece_type;
      if (!kingAttacked(samePieceKing, newOppPieces, tempBoard, dupePieces))
        legalMoves.push(move);
    }
    return legalMoves;
  }
}

/**
 * @param {string[][]} board 
 * @returns {string[][]}
 */
function duplicateBoard(board) {
  const b = [];
  for (let i = 0; i < board.length; i++) {
    b.push([]);
    for (let j = 0; j < board[i].length; j++) {
      b[i].push(board[i][j]);
    }
  }
  return b;
}
/**
 * 
 * @param {Piece[]} pieces 
 * @returns {Piece[]}
 */
function dupePiecesArray(pieces) {
  const p = [];

  for (const piece of pieces)
    p.push(piece);

  return p;
}

/**
 * @param {King} king 
 * @param {Piece[]} opponentPieces 
 * @param {string[][]} board
 * @param {Piece[]} pieceArray
 */
function kingAttacked(king, opponentPieces, board, pieceArray) {
  let kingAttacked = false;

  outer: for (const oppPiece of opponentPieces) {
    const oppMoves = oppPiece.getMoves(board, pieceArray);
    for (const m of oppMoves) {
      if (m[1] === king.location[0] && m[0] === king.location[1]) {
        kingAttacked = true;
        break outer;
      }
    }
  }

  return kingAttacked;
}

/**
 * 
 * @param {King} king 
 * @param {string[][]} board 
 * @param {Piece[]} pieceArray 
 */
function checkmate(king, board, pieceArray) {
  if (filterLegalMoves(king, board, pieceArray).length < 1) {
    const teamPieces = pieceArray.filter(p => p.color === king.color).filter(p => p.piece_type[1] !== "k");
    let anyLegalMoves = [];

    for (const p of teamPieces) {
      const legalMoves = filterLegalMoves(p, board, pieceArray);
      anyLegalMoves = anyLegalMoves.concat(legalMoves);
    }

    if (anyLegalMoves.length < 1) return true;

  }  
}
/**
 * 
 * @param {[number, number]} cords 
 */
function cordsToString(cords) {
  const letter = colMap[cords[1]]
  return `${letter}${8 - cords[0]}`;
}