const boardSize = 800;
const pieceSize = boardSize / 8;

class Piece {
  /**
   * @type {[number, number]}
   */
  location;
  has_moved = false;
  color;
  moveMulti;
  piece_type;

  constructor(location, color) {
    this.location = location;
    this.color = color;
    this.moveMulti = this.color === "b" ? 1 : -1;
  }

  /**
   * @param {[number, number]} location
   */
  set location(location) {
    this.location = location;
  }

  /**
   * @param {string[][]} board 
   */
  getMoves(board) {};
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
      let capturedPiece;
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
    const arrOfMoves = [
      [-2, 1],
      [-1, 2],
      [1, 2],
      [2, 1],
      [2, -1],
      [1, -2],
      [-1, -2],
      [-2, -1],
    ];

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
    const moveTypes = [
      [-1, 1], // up right
      [1, 1], // down right
      [1, -1], // down left
      [-1, -1], // up right
    ];

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
  
  getMoves(board) {
    return [];
  }
};

let selectedPiece = null;
window.onload = async () => {

  const canvas = document.getElementById("canvas");
  canvas.width = boardSize;
  canvas.height = boardSize;

  const startFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
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
  renderBoard(board, ctx, pieceMap, null);

  window.onclick = (event) => {
    const cords = getCursorPosition(canvas, event).reverse().map(v => Math.floor(v / 100));

    ////// REMOVE PIECE FROM PIECES  ARRAY

    if (selectedPiece && selectedPiece.getMoves(board).find(v => v[0] === cords[1] && v[1] === cords[0])) {
      if (board[cords[0]][cords[1]][0] !== selectedPiece.color && board[cords[0]][cords[1]] !== "") 
        pieceArray.splice(pieceArray.findIndex(v => v.location[0] === cords[0] && v.location[1] === cords[1]), 1);

      const oldPos = selectedPiece.location;
      selectedPiece.location = cords;
      selectedPiece.has_moved = true;
      board[cords[0]][cords[1]] = selectedPiece.piece_type;
      board[oldPos[0]][oldPos[1]] = "";
      
      selectedPiece = null;
      renderBoard(board, ctx, pieceMap, null);
    } else {
      const pieceAtLocation = pieceArray.find(p => p.location[0] === cords[0] && p.location[1] === cords[1]);
      if (pieceAtLocation) { 
        selectedPiece = pieceAtLocation;
        const moves = pieceAtLocation.getMoves(board);
        renderBoard(board, ctx, pieceMap, pieceAtLocation.location);
        for (const m of moves) {
          if (board[m[1]][m[0]] === "")
            ctx.drawImage(move, m[0] * pieceSize, m[1] * pieceSize, pieceSize, pieceSize);
          else
            ctx.drawImage(take, m[0] * pieceSize, m[1] * pieceSize, pieceSize, pieceSize);
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

  ctx.font = "25px arial";
  ctx.fillStyle = "#33694C";
  ctx.fillText("b", 185, 793);
  ctx.fillText("d", 385, 793);
  ctx.fillText("f", 585, 793);
  ctx.fillText("h", 785, 793);

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