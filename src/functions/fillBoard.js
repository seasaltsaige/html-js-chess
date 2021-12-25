/**
 * @param {string} fen 
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
 *  }}
 */
function fillBoard(fen) {
  const fenParts = fen.split(" ");

  const mainStr = fenParts[0];
  const turn = fenParts[1];
  const castleRights = fenParts[2];
  const enPassant = fenParts[3];
  const halfMoveClock = fenParts[4];
  const fullMoveClock = fenParts[5];

  const board = [[]];
  let row = 0;
  for (const l of mainStr) {
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