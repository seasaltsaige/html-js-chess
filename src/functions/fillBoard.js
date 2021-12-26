/**
 * @param {string} fen fen string to convert to board
 * @returns {{
 *  board: string[][],
 *  turn: "w" | "b",
 *  castleRights: {
 *    black: {
 *      queenSide: boolean,
 *      kingSide: boolean,
 *    };
 *    white: {
 *      queenSide: boolean,
 *      kingSide: boolean,
 *    }
 *  },
 *  enPassant: string,
 *  halfMoveClock: number,
 *  fullMoveClock: number
 *  }} all data required to start the game
 */
function fillBoard(fen) {
  const fenParts = fen.split(" ");
  // get all parts of fen string. Parts are seperated by spaces
  // https://www.chess.com/terms/fen-chess
  const mainStr = fenParts[0];
  const turn = fenParts[1];
  const castleRights = fenParts[2];
  const enPassant = fenParts[3];
  const halfMoveClock = fenParts[4];
  const fullMoveClock = fenParts[5];

  // initial board
  const board = [[]];
  let row = 0;
  // go through each value of fen string
  for (const l of mainStr) {
    // if its not a number
    if (isNaN(parseInt(l))) {
      // if its a /, add to row, push a new empty array (new row)
      if (l === "/") {
        row++;
        board.push([]);
        continue;
      // if its a lowercase letter (black piece)
      // push (b + piece)
      } else if (l === l.toLowerCase()) {
        board[row].push(`b${l}`);
      // otherwise push (w + piece)
      } else if (l !== l.toLowerCase()) {
        board[row].push(`w${l.toLowerCase()}`);
      }
    // otherwise, for the size of the number, add an empty string to the array
    } else {
      for (let i = 0; i < parseInt(l); i++) {
        board[row].push("");
      }
    }
  }

  // castle rights are based off of 3rd part of the string
  // k and q are for blacks kingside and queenside castle rights
  // K and Q are for whites kingside and queenside castle rights
  const castleAbility = {
    black: {
      queenSide: castleRights.includes("q"),
      kingSide: castleRights.includes("k"),
    },
    white: {
      queenSide: castleRights.includes("Q"),
      kingSide: castleRights.includes("K"),
    }
  }
  return {
    board,
    turn,
    castleRights: castleAbility,
    enPassant,
    halfMoveClock: parseInt(halfMoveClock),
    fullMoveClock: parseInt(fullMoveClock)
  }
}