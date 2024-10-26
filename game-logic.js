const gridContainer = document.getElementsByClassName("grid-container")[0];
const cells = document.querySelectorAll(".cell");
const turn = document.getElementById("turn");
const gameStatus = document.getElementById("game-status");
const resetButton = document.getElementById("reset");

const X = "X";
const O = "O";

const gridState = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
]

const checkGameStatus = (row, col) => {
  const isDiagonal = (row+col)%2===0;
  const isLeftDiagonal = row===col;

  let won = false;
  let cells = [];

  // same row
  if (gridState[row][0]===gridState[row][1] && gridState[row][1]===gridState[row][2]) {
    won = true;
    cells.push([row, 0], [row, 1], [row, 2]);
  }
  // same column
  if (gridState[0][col]===gridState[1][col] && gridState[1][col]===gridState[2][col]) {
    won = true;
    cells.push([0, col], [1, col], [2, col]);
  }
  // left diagonal
  if (isDiagonal && isLeftDiagonal && gridState[0][0]===gridState[1][1] && gridState[1][1]===gridState[2][2]) {
    won = true;
    cells.push([0, 0], [1, 1], [2, 2]);
  }
  // right diagonal
  if (isDiagonal && !isLeftDiagonal && gridState[0][2]===gridState[1][1] && gridState[1][1]===gridState[2][0]) {
    won = true;
    cells.append([2, 0], [1, 1], [0, 2]);
  }
  return { won: won, winningCells: cells };
}

const handleCellClick = (cell) => {
  const playerTurn = turn.innerText;
  cell.innerText = playerTurn;
  turn.innerText = (playerTurn===X) ? O : X;

  const row = Math.floor(cell.id / 3), col = cell.id % 3;
  gridState[row][col] = playerTurn;

  cell.disabled = true;

  const { won, winningCells } = checkGameStatus(row, col);

  if (won) {
    gameStatus.innerText = `Player ${playerTurn} wins!`;
    winningCells.forEach(c => 
      cells[c[0]*3+c[1]].classList.add("won")
    )
  }
}

const handleReset = () => {
  gameStatus.innerText = "Turn: X";
  turn.innerText = X;

  cells.forEach(cell => {
    cell.classList.remove("won");
    cell.disabled = false;
    cell.innerText = "";
  })
}

cells.forEach(cell =>
  cell.addEventListener("click", () => handleCellClick(cell))
)

resetButton.addEventListener("click", handleReset);
