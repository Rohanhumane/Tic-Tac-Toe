import { useCallback, useEffect, useState } from "react";
import classes from "./Button.module.css";

const MainBoard = () => {
  const [boardArray, setBoardArray] = useState<string[][]>(
    Array.from({ length: 3 }, () => Array(3).fill(""))
  );

  const [valueXorO, setValueXorO] = useState<"X" | "O" | "">("X");

  const [checkAnswer, setcheckAnswer] = useState<{
    ans: "X" | "O" | "";
    check: boolean | undefined;
  }>({ ans: "", check: undefined });

  const [hover, setHover] = useState<{
    row: number;
    column: number;
  } | null>(null);

  const clickfnc = (row: number, col: number) => {
    let present = false;
    const newBoardArray = boardArray.map((subArray, rowIdx) =>
      subArray.map((cell, colIdx) => {
        if (
          rowIdx === row &&
          colIdx === col &&
          boardArray[row][col] === "" &&
          !checkAnswer.check
        ) {
          present = true;
          return valueXorO; // Update the cell value to "O" or "X"
        }
        return cell;
      })
    );

    if (present) {
      setBoardArray(newBoardArray);
      setValueXorO((prevState) => {
        if (!checkAnswer.check) {
          return prevState === "O" ? "X" : "O";
        }
        return "";
      });

      setHover(null); // Reset hover state on click
      setTimeout(() => setHover({ row, column: col }), 0); // Re-enable hover state after a short delay
    }
  };

  const handleMouseEnter = (row: number, col: number) => {
    setHover(() => {
      return { ...hover, text: "", row, column: col };
    });
  };

  const handleMouseLeave = () => {
    setHover(null);
  };

  useEffect(() => {
    const check = (
      array: string[][]
    ): { result: boolean; ans: "" | "X" | "O" } => {
      const n = array.length;

      // Helper function to check if all elements in a line are the same
      const checkLine = (line: string[]): boolean => {
        return line.every((val) => val !== "" && val === line[0]);
      };

      // Check rows and columns
      for (let i = 0; i < n; i++) {
        if (checkLine(array[i])) {
          return { result: true, ans: array[i][0] as "X" | "O" };
        }

        const col = array.map((row) => row[i]);
        if (checkLine(col)) {
          return { result: true, ans: col[0] as "X" | "O" };
        }
      }

      // Check diagonals
      const diagonal1 = array.map((row, i) => row[i]);
      const diagonal2 = array.map((row, i) => row[n - i - 1]);

      if (checkLine(diagonal1)) {
        return { result: true, ans: diagonal1[0] as "X" | "O" };
      }

      if (checkLine(diagonal2)) {
        return { result: true, ans: diagonal2[0] as "X" | "O" };
      }

      return { result: false, ans: "" };
    };

    const result = check(boardArray);

    setcheckAnswer({
      check: result.result,
      ans: result.ans,
    });
  }, [boardArray]);

  const handleRestart = () => {
    setBoardArray(() => Array.from({ length: 3 }, () => Array(3).fill("")));
  };

  return (
    <div className={classes.boxContainer}>
      <h1>Tic Tac Toe Game</h1>
      {boardArray.map((subArray, rowIdx) => (
        <div key={rowIdx} className={classes.row}>
          {subArray.map((_, colIdx) => (
            <button
              key={colIdx}
              className={`${classes.button} ${
                hover &&
                hover.row === rowIdx &&
                hover.column === colIdx &&
                classes.hover
              } ${classes.innerText}`}
              onClick={() => clickfnc(rowIdx, colIdx)}
              onMouseOver={() => handleMouseEnter(rowIdx, colIdx)}
              onMouseLeave={handleMouseLeave}
              disabled={boardArray[rowIdx][colIdx] !== "" && !checkAnswer.check}
            >
              {boardArray[rowIdx][colIdx]}
            </button>
          ))}
        </div>
      ))}
      {checkAnswer.check && (
        <div>
          <h2>{checkAnswer.ans} Winner</h2>
        </div>
      )}

      {!checkAnswer.check && boardArray.flat().every((cell) => cell !== "") && (
        <h2>It's is Draw</h2>
      )}

      {(checkAnswer.check ||
        boardArray.flat().every((cell) => cell !== "")) && (
        <button className="restart" onClick={handleRestart}>
          Restart
        </button>
      )}
    </div>
  );
};

export default MainBoard;

// useEffect(() => {
//   const check = (
//     array: string[][],
//     row: number,
//     col: number,
//     ans: string
//   ): { result: boolean; ans: "" | "X" | "O" } => {
//     // Check for out-of-bounds row or column
//     if (
//       row < 0 ||
//       row >= array.length ||
//       col < 0 ||
//       col >= array[row].length
//     ) {
//       return { result: false, ans: "" };
//     }

//     // Vertical check
//     if (
//       row > 0 &&
//       row < array.length - 1 &&
//       array[row - 1][col] === ans &&
//       array[row][col] === ans &&
//       array[row + 1][col] === ans &&
//       ans !== ""
//     ) {
//       return { result: true, ans: ans as "O" | "X" };
//     }

//     // Horizontal check
//     if (
//       col > 0 &&
//       col < array[row].length - 1 &&
//       array[row][col - 1] === ans &&
//       array[row][col] === ans &&
//       array[row][col + 1] === ans &&
//       ans !== ""
//     ) {
//       return { result: true, ans: ans as "O" | "X" };
//     }

//     // Diagonal check (top-left to bottom-right)
//     if (
//       row > 0 &&
//       row < array.length - 1 &&
//       col > 0 &&
//       col < array[row].length - 1 &&
//       array[row - 1][col - 1] === ans &&
//       array[row][col] === ans &&
//       array[row + 1][col + 1] === ans &&
//       ans !== ""
//     ) {
//       return { result: true, ans: ans as "O" | "X" };
//     }

//     // Diagonal check (top-right to bottom-left)
//     if (
//       row > 0 &&
//       row < array.length - 1 &&
//       col > 0 &&
//       col < array[row].length - 1 &&
//       array[row - 1][col + 1] === ans &&
//       array[row][col] === ans &&
//       array[row + 1][col - 1] === ans &&
//       ans !== ""
//     ) {
//       return { result: true, ans: ans as "O" | "X" };
//     }

//     // Move to next row or next column if in bounds
//     if (col < array[row].length - 1) {
//       return check(array, row, col + 1, array[row][col + 1]);
//     } else if (row < array.length - 1) {
//       return check(array, row + 1, 0, array[row + 1][0]);
//     }

//     return { result: false, ans: "" };
//   };

//   const result = check(boardArray, 0, 0, boardArray[0][0]);

//   setcheckAnswer({
//     check: result.result,
//     ans: result.ans,
//   });
// }, [boardArray]);
