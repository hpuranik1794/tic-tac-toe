const gridContainer = document.getElementsByClassName("grid-container")[0];
const cells = document.querySelectorAll(".cell");
const turn = document.getElementById("turn");
const gameStatus = document.getElementById("game-status");
const resetButton = document.getElementById("reset-button");
const xwins = document.getElementById("x");
const owins = document.getElementById("y");
const ties = document.getElementById("ties");

const X = "X";
const O = "O";

class ScoreBoard {
  constructor() {
    this.xwins = 0;
    this.owins = 0;
    this.ties = 0;
  }

  update(outcome) {
    switch (outcome) {
      case X:
        this.xwins+=1;
        xwins.innerText = this.xwins;
        break;
      case O:
        this.owins+=1;
        owins.innerText = this.owins;
        break;
      case "tie":
        this.ties+=1;
        ties.innerText = this.ties;
        break;
    }
  }
}

class Game {
  constructor() {
    this.gridState = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];
    this.inPlay = true;
    this.outcome = "";
    this.currentPlayer = X;
    this.currentCell = [];
    this.winningCells = [];
  };

  updateGame() {
    // check for win
    const row = this.currentCell[0], col = this.currentCell[1];
    const isDiagonal = (row+col)%2===0;
    const isLeftDiagonal = row===col;

    if (this.gridState[row][0]===this.gridState[row][1] && this.gridState[row][1]===this.gridState[row][2]) {
      this.outcome = "win";
      this.inPlay = false;
      this.winningCells.push([row, 0], [row, 1], [row, 2]);
    }
    // same column
    if (this.gridState[0][col]===this.gridState[1][col] && this.gridState[1][col]===this.gridState[2][col]) {
      this.outcome = "win";
      this.inPlay = false;
      this.winningCells.push([0, col], [1, col], [2, col]);
    }
    // left diagonal
    if (isDiagonal && isLeftDiagonal && this.gridState[0][0]===this.gridState[1][1] && this.gridState[1][1]===this.gridState[2][2]) {
      this.outcome = "win";
      this.inPlay = false;
      this.winningCells.push([0, 0], [1, 1], [2, 2]);
    }
    // right diagonal
    if (isDiagonal && !isLeftDiagonal && this.gridState[0][2]===this.gridState[1][1] && this.gridState[1][1]===this.gridState[2][0]) {
      this.outcome = "win";
      this.inPlay = false;
      this.winningCells.push([2, 0], [1, 1], [0, 2]);
    }

    if (this.outcome==="win") return;

    // check for a tie
    let tie = false;
    let j = 0;
    for (let i = 0; i < 9; ++i) {
      if (this.gridState[i%3][j%3]==='') {
        tie = false;
        break;
      }
      if (i%3===2) ++j;
      tie = true;
    }

    if (tie) {
      this.inPlay = false;
      this.outcome = "tie";
      return;
    }
  }

  updateCell(cell) {
    if (!this.inPlay) return;

    cell.innerText = this.currentPlayer;
    turn.innerText = (this.currentPlayer===X) ? O : X;

    const row = Math.floor(cell.id / 3), col = cell.id % 3;
    this.gridState[row][col] = this.currentPlayer;
    this.currentCell = [row, col]

    cell.disabled = true;

    this.updateGame();

    if (!this.inPlay) {
      if (this.outcome==="tie") {
        gameStatus.innerText = "Tie game!";
        scoreboard.update("tie");
        return;
      }

      gameStatus.innerText = `Player ${this.currentPlayer} wins!`;
      this.winningCells.forEach(c => 
        cells[c[0]*3+c[1]].classList.add("won")
      )
      scoreboard.update(this.currentPlayer);
    }

    this.currentPlayer = (this.currentPlayer===X) ? O : X;
  };

  reset = () => {
    gameStatus.innerText = "Turn: X";
    turn.innerText = X;
    this.inPlay = true;
    this.outcome = "";
    this.currentPlayer = X;
    this.winningCells = [];
    this.currentCell = [];
    this.gridState = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];
  
    cells.forEach(cell => {
      cell.classList.remove("won");
      cell.disabled = false;
      cell.innerText = "";
    })
  };
}

const game = new Game();
const scoreboard = new ScoreBoard();

cells.forEach(cell =>
  cell.addEventListener("click", () => game.updateCell(cell))
)

resetButton.addEventListener("click", game.reset);
