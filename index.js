// The size in pixels of the chess board
const boardSize = 800;
// the size of each individual square, and thus the pieces, in pixels
const pieceSize = boardSize / 8;

/**
 * The actively selected piece, null if none
 * @type {Piece | null}
 */
let selectedPiece = null;
/**
 * Array of past fen positions
 * This is used to check for threefold repitition
 * Occurs if the same FEN string appears in the array 3 times
 * @type {string[]}
 */
const fenArrayForDrawByRepition = [];
// used to write to board
const colMap = ["a", "b", "c", "d", "e", "f", "g", "h"];

window.onload = async () => {
  // current move number, starting at 1. One move is both white and black moving
  let moveNumber = 1;
  // current ply number, (one ply is half a move, ie: black OR white moving)
  let halfMoveNumber = 0;
  // initial position, initial board position, turn, castle rights, en passant square, halfmove counter, fullmove counter
  let startFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const date = new Date();

  /**
   * Current turn
   * @type {"b" | "w"}
   */
  let turn = "w";

  // PGN string to keep track of game, can be used in other websites
  // such as chess.com to analyze the game
  let pgnString = 
  `[Event "Homemade Chess"]
[Date "${date.getFullYear()}.${date.getMonth()}.${date.getDay()}"]
[Round "1"]
[White "White"]
[Black "Black"]
[FEN "${startFEN}"]
[Result "*"]
${moveNumber}. `;

  // Start game sound effect
  const startGame = document.getElementById("start");
  startGame.play();

  // More sound effects. Self explanitory
  const castleSound = document.getElementById("castle");
  const moveSound = document.getElementById("moveAudio");
  const takeSound = document.getElementById("capture");
  const checkSound = document.getElementById("check");
  const checkmateSound = document.getElementById("checkmate");
  const stalemateSound = document.getElementById("stalemate");

  // Buttons to copy fen and pgn
  const fenButton = document.getElementById("fen");
  const pgnButton = document.getElementById("pgn");

  // Promotion board (1x4) .png
  const pawnPromotionBoard = document.getElementById("promote");
  // main game canvas element
  const canvas = document.getElementById("canvas");
  canvas.width = boardSize;
  canvas.height = boardSize;
  // pawn promotion canvas element
  const secondaryCanvas = document.getElementById("pawn");
  secondaryCanvas.width = boardSize;
  secondaryCanvas.height = boardSize;

  // move and take images
  const move = document.getElementById("move");
  const take = document.getElementById("take");

  let {
    board,
    castleRights,
    enPassant,
    fullMoveClock,
    halfMoveClock,
    turn: t
  } = fillBoard(startFEN);

  halfMoveNumber = halfMoveClock;
  moveNumber = fullMoveClock;
  turn = t;

  // piece map to piece initials (maps to piece image)
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

  // class map, piece name to class type
  const classMap = {
    p: Pawn,
    r: Rook,
    b: Bishop,
    n: Knight,
    q: Queen,
    k: King,
  };

  // copy fen string
  fenButton.onclick = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    navigator.clipboard.writeText(startFEN);
  }

  // copy pgn string
  pgnButton.onclick = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    navigator.clipboard.writeText(pgnString);
  }

  /**
   * Array of all pieces in the game
   * Modified when piece is taken (removes piece)
   * Modified when pawn promotes (removes pawn, adds new piece)
   * @type {Piece[]}
   */
  const pieceArray = [];
  // counter to keep track of current piece
  let counter = 0;
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const piece = classMap[board[row][col][1]];
      if (piece) {
        pieceArray.push(new piece([row, col], board[row][col][0] === "b" ? "b" : "w"));
        const p = pieceArray[counter];

        // Check castling rights, if castle rights are allowed, king/rooks
        // have not moved, otherwise they have.
        if (p.piece_type[1] === "k") {
          if (p.color === "w") {
            if (!castleRights.white.kingSide && !castleRights.white.queenSide)
              p.has_moved = true;
          } else {
            if (!castleRights.black.kingSide && !castleRights.black.queenSide)
              p.has_moved = true;
          }
        } else if (p.piece_type[1] === "r") {
          if (p.color === "b") {
            if (p.startingLocation[0] !== 0 && (p.startingLocation[1] !== 0 || p.startingLocation[1] !== 7))
              p.has_moved = true;
          } else {
            if (p.startingLocation[0] !== 7 && (p.startingLocation[1] !== 0 || p.startingLocation[1] !== 7))
              p.has_moved = true;
          }
        }
        counter++;
      }
    }
  }

  // get canvas rendering context
  const ctx = canvas.getContext("2d");
  const pawnPromotion_ctx = secondaryCanvas.getContext("2d");
  // render initial board
  renderBoard(board, ctx, pieceMap, null);

  // set onclick function
  window.onclick = clickEventFN;
  // this is set as a seperate function to allow different behavior when promoting a pawn
  function clickEventFN (event) {
    // gets cursor cords on canvas
    const cords = getCursorPosition(canvas, event).reverse().map(v => Math.floor(v / 100));

    // If you click when the selected piece is not null
    // handle possible move or setting selected piece back to 
    // null if invaled move square is clicked
    if (selectedPiece !== null) {
      const moves = filterLegalMoves(selectedPiece, board, pieceArray, enPassant)// selectedPiece.getMoves(board, pieceArray);
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
            if (rook_col === 7) pgnString += "O-O ";
            else if (rook_col === 0) pgnString += "O-O-O ";

            turn = turn === "w" ? "b" : "w";

            const oldFenArr = startFEN.split(" ");
            oldFenArr.shift();
            oldFenArr.shift();
            const newFen = boardToFEN(board);
            startFEN = newFen + turn + oldFenArr.join(" ");

            fenArrayForDrawByRepition.push(startFEN);

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

            const oldFenArr = startFEN.split(" ");
            oldFenArr.shift();
            oldFenArr.shift();
            const newFen = boardToFEN(board);
            turn = turn === "w" ? "b" : "w";

            startFEN = newFen + turn + oldFenArr.join(" ");

            fenArrayForDrawByRepition.push(startFEN);

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

        const enPassantCords = fenToPosition(enPassant);

        let takenPawnCords;
        if (selectedPiece.piece_type[1] === "p" && enPassantCords[0] === cords[0] && enPassantCords[1] === cords[1]) {
          tookPiece = true;
          takenPawnCords = [turn === "w" ? enPassantCords[0] + 1 : enPassantCords[0] - 1, enPassantCords[1]];
        }

        const oldPos = selectedPiece.location;
        selectedPiece.location = cords;
        selectedPiece.has_moved = true;
        board[cords[0]][cords[1]] = selectedPiece.piece_type;
        board[oldPos[0]][oldPos[1]] = "";
        if (takenPawnCords) {
          pieceArray.splice(pieceArray.findIndex(p => p.location[0] === takenPawnCords[0] && p.location[1] === takenPawnCords[1]), 1);
          board[takenPawnCords[0]][takenPawnCords[1]] = "";
        }

        const opponentKing = pieceArray.find(p => p.piece_type[1] === "k" && p.color !== turn);
        const oppKingAttacked = kingAttacked(opponentKing, pieceArray.filter(p => p.color === turn).filter(p => p.piece_type[1] !== "k"), board, pieceArray);

        let isPromotion = false;

        if (selectedPiece.piece_type[1] === "p") {
          if ((selectedPiece.color === "w" && selectedPiece.location[0] === 0) || (selectedPiece.color === "b" && selectedPiece.location[0] === 7))  {
            isPromotion = true;
            pawnPromotion_ctx.drawImage(pawnPromotionBoard, canvas.width/2 - 200, canvas.height/2 - 50, 400, 100);
            pawnPromotion_ctx.rect(canvas.width/2 - 200, canvas.height/2 - 50, 400, 100);
            pawnPromotion_ctx.textAlign = "center";
            pawnPromotion_ctx.font = "50px bold arial";
            pawnPromotion_ctx.fillStyle = "black";
            pawnPromotion_ctx.fillText("Choose a piece to promote to", canvas.width/2, canvas.height/2-70);
            pawnPromotion_ctx.drawImage(pieceMap[turn + "r"], canvas.width/2-200, canvas.width/2-50, pieceSize, pieceSize);
            pawnPromotion_ctx.drawImage(pieceMap[turn + "n"], canvas.width/2-100, canvas.height/2-50, pieceSize, pieceSize);
            pawnPromotion_ctx.drawImage(pieceMap[turn + "b"], canvas.width/2, canvas.width/2-50, pieceSize, pieceSize);
            pawnPromotion_ctx.drawImage(pieceMap[turn + "q"], canvas.width/2+100, canvas.height/2-50, pieceSize, pieceSize);
            pawnPromotion_ctx.lineWidth = 5;
            pawnPromotion_ctx.stroke();

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
                  pawnPromotion_ctx.clearRect(0, 0, secondaryCanvas.width, secondaryCanvas.height);
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
                    
                    roundRect(ctx, canvas.width / 2 - (textWidth / 2) - 50, canvas.height/2 - 100, textWidth + 100, 170, 30);
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
                    pgnString += `${oldFen[0]}x${fenStr}=${piece.piece_type[1].toUpperCase()} `;
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

        
        const newMainFENString = boardToFEN(board);
        let pasFen = "-";
        let newHalfMove = 0;
        if (Math.abs(oldPos[0] - selectedPiece.location[0]) === 2 && selectedPiece.piece_type[1] === "p") {
          const passantcords = turn === "w" ? [selectedPiece.location[0] + 1, selectedPiece.location[1]] : [selectedPiece.location[0] - 1, selectedPiece.location[1]];
          pasFen = cordsToString(passantcords);
        }
        if (selectedPiece.piece_type[1] !== "p" && !tookPiece) {
          newHalfMove = halfMoveClock + 1;
          halfMoveClock++;
        } else {
          halfMoveClock = newHalfMove;
        }
        
        const newCastleRights = {
          black: {
            queenSide: !pieceArray.find(p => p.startingLocation[0] === 0 && p.startingLocation[1] === 0)?.has_moved,
            kingSide: !pieceArray.find(p => p.startingLocation[0] === 0 && p.startingLocation[1] === 7)?.has_moved,
          },
          white: {
            queenSide: !pieceArray.find(p => p.startingLocation[0] === 7 && p.startingLocation[1] === 0)?.has_moved,
            kingSide: !pieceArray.find(p => p.startingLocation[0] === 7 && p.startingLocation[1] === 7)?.has_moved,
          }
        }

        const blackKingMoved = pieceArray.find(p => p.piece_type === "bk").has_moved;
        const whiteKingMoved = pieceArray.find(p => p.piece_type === "wk").has_moved;

        if (blackKingMoved) {
          newCastleRights.black.queenSide = false;
          newCastleRights.black.kingSide = false;
        }

        if (whiteKingMoved) {
          newCastleRights.white.queenSide = false;
          newCastleRights.white.kingSide = false;
        }

        let castleRightsString = `${newCastleRights.white.kingSide ? "K" : ""}${newCastleRights.white.queenSide ? "Q" : ""}${newCastleRights.black.kingSide ? "k" : ""}${newCastleRights.black.queenSide ? "q" : ""}`;
        if (castleRightsString.length === 0) castleRightsString = "-";

        if (!isPromotion) {
          if (checkMate) {
            window.onclick = () => {};
            checkmateSound.play();
            ctx.fillStyle = "rgb(31, 32, 43)";
            ctx.font = "50px bold arial";
            const { width: textWidth } = ctx.measureText(`${turn === "w" ? "White" : "Black"} won due to checkmate!`);
            
            roundRect(ctx, canvas.width / 2 - (textWidth / 2) - 50, canvas.height/2 - 100, textWidth + 100, 170, 30);
            ctx.fill();
            ctx.fillStyle = "white";
            ctx.fillText(`${turn === "w" ? "White" : "Black"} won due to checkmate!`, canvas.width/2, canvas.height/2);

            let pieceForPGN = selectedPiece.piece_type[1].toUpperCase();

            const fen = cordsToString(cords);
            const oldFen = cordsToString(oldPos);
            if (tookPiece) pgnString += `${pieceForPGN.toLowerCase() === "p" ? oldFen[0] : pieceForPGN}x${fen}# ${turn === "w" ? "1-0" : "0-1"}`;
            else pgnString += `${pieceForPGN.toLowerCase() === "p" ? "" : pieceForPGN + cordsToString(oldPos)[0]}${fen}# ${turn === "w" ? "1-0" : "0-1"}`;
            pgnString = pgnString.replace("Result \"*\"", `Result "${turn === "w" ? "1-0" : "0-1"}"`)
            navigator.clipboard.writeText(pgnString);
          } else if (oppKingAttacked) {
            checkSound.play();
            let pieceForPGN = selectedPiece.piece_type[1].toUpperCase();
            const fen = cordsToString(cords);
            const oldFen = cordsToString(oldPos);
            if (tookPiece) pgnString += `${pieceForPGN.toLowerCase() === "p" ? oldFen[0] : pieceForPGN}x${fen}+ `;
            else pgnString += `${pieceForPGN.toLowerCase() === "p" ? "" : pieceForPGN + cordsToString(oldPos)[0]}${fen}+ `;
          } else if (tookPiece) {
            takeSound.play();
            let pieceForPGN = selectedPiece.piece_type[1].toUpperCase();
            const fen = cordsToString(cords);
            const oldFen = cordsToString(oldPos);
            pgnString += `${pieceForPGN.toLowerCase() === "p" ? oldFen[0] : pieceForPGN + cordsToString(oldPos)[0]}x${fen} `;
          } else {
            let pieceForPGN = selectedPiece.piece_type[1].toUpperCase();
            const fen = cordsToString(cords);
            pgnString += `${pieceForPGN.toLowerCase() === "p" ? "" : pieceForPGN + cordsToString(oldPos)[0]}${fen} `;
            moveSound.play();
          }
        }
        turn = turn === "w" ? "b" : "w";
        if (turn === "w") {
          moveNumber++;
          pgnString += `${moveNumber}. `;
        } 

        startFEN = `${newMainFENString} ${turn} ${castleRightsString} ${pasFen} ${newHalfMove} ${moveNumber}`

        fenArrayForDrawByRepition.push(startFEN);
        
        enPassant = pasFen;
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
        const moves = filterLegalMoves(pieceAtLocation, board, pieceArray, enPassant);
        renderBoard(board, ctx, pieceMap, pieceAtLocation.location);
        for (const m of moves) {
          if (typeof m === "string") {
            const row = pieceAtLocation.color === "w" ? 7 : 0;
            const col_to_highlight = m === "king_side_castle" ? 6 : 2;
            ctx.drawImage(move, col_to_highlight * pieceSize, row * pieceSize, pieceSize, pieceSize);
          } else {
            const fenStr = cordsToString([m[1], m[0]]);
            if (pieceAtLocation.piece_type[1] === "p" && fenStr === enPassant) {
              ctx.drawImage(take, m[0] * pieceSize, m[1] * pieceSize, pieceSize, pieceSize);
              continue;
            }

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

    const lastPieceKing = pieceArray.find(p => p.color === turn && p.piece_type[1] === "k");

    if (fenArrayForDrawByRepition.filter(v => v.slice(0, v.length - 4) === startFEN.slice(0, v.length - 4)).length === 3) {
      window.onclick = () => {};
      ctx.fillStyle = "rgb(31, 32, 43)";
      ctx.font = "50px bold arial";
      const { width: textWidth } = ctx.measureText(`Draw due to repetition!`);
      
      roundRect(ctx, canvas.width / 2 - (textWidth / 2) - 50, canvas.height/2 - 100, textWidth + 100, 170, 30);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.fillText(`Draw due to repetition!`, canvas.width/2, canvas.height/2);

      stalemateSound.play();
      pgnString = pgnString.slice(0, pgnString.length - 3);
      pgnString += "1/2-1/2";
      pgnString = pgnString.replace("Result \"*\"", `Result "1/2-1/2"`)
      navigator.clipboard.writeText(pgnString);

    } else if (parseInt(startFEN.split(" ")[4]) === 50) {
      window.onclick = () => {};
      ctx.fillStyle = "rgb(31, 32, 43)";
      ctx.font = "50px bold arial";
      const { width: textWidth } = ctx.measureText(`Draw due to repetition!`);
      
      roundRect(ctx, canvas.width / 2 - (textWidth / 2) - 50, canvas.height/2 - 100, textWidth + 100, 170, 30);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.fillText(`Draw due to 50-move rule!`, canvas.width/2, canvas.height/2);

      stalemateSound.play();
      pgnString = pgnString.slice(0, pgnString.length - 3);
      pgnString += "1/2-1/2";
      pgnString = pgnString.replace("Result \"*\"", `Result "1/2-1/2"`)
      navigator.clipboard.writeText(pgnString);
    } else if (draw(lastPieceKing, board, pieceArray)) {
      window.onclick = () => {};
      ctx.fillStyle = "rgb(31, 32, 43)";
      ctx.font = "50px bold arial";
      const { width: textWidth } = ctx.measureText(`Draw due to repetition!`);
      
      roundRect(ctx, canvas.width / 2 - (textWidth / 2) - 50, canvas.height/2 - 100, textWidth + 100, 170, 30);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.fillText(`Draw due to stalemate!`, canvas.width/2, canvas.height/2);

      stalemateSound.play();
      pgnString = pgnString.slice(0, pgnString.length - 3);
      pgnString += "1/2-1/2";
      pgnString = pgnString.replace("Result \"*\"", `Result "1/2-1/2"`)
      navigator.clipboard.writeText(pgnString);
    } else if (insufficientMaterial(pieceArray)) {
      window.onclick = () => {};
      ctx.fillStyle = "rgb(31, 32, 43)";
      ctx.font = "50px bold arial";
      const { width: textWidth } = ctx.measureText(`Draw due to insufficient material!`);
      
      roundRect(ctx, canvas.width / 2 - (textWidth / 2) - 50, canvas.height/2 - 100, textWidth + 100, 170, 30);
      ctx.fill();
      ctx.fillStyle = "white";
      ctx.fillText(`Draw due to insufficient material!`, canvas.width/2, canvas.height/2);

      stalemateSound.play();
      pgnString = pgnString.slice(0, pgnString.length - 3);
      pgnString += "1/2-1/2";
      pgnString = pgnString.replace("Result \"*\"", `Result "1/2-1/2"`)
      navigator.clipboard.writeText(pgnString);
    }
  }
}