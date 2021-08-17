const board = document.getElementById('board');
const title = document.getElementById('title');
const cell = document.getElementsByClassName('cell');
const resetButton = document.getElementById('reset');
const xStat = document.getElementById('x');
const oStat = document.getElementById('o');
const drawStat = document.getElementById('draw');
const clearStatsButton = document.getElementById('clear-stats')

title.innerHTML = 'TicTacToe'

const player = 'x';
const computer = 'o';
const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

for (let i = 0; i < 9; i++) {
  board.innerHTML += "<div class='cell'></div>"
}

for (let i = 0; i < cell.length; i++) {
  cell[i].addEventListener('click', cellClick)
}

resetButton.addEventListener('click', () => {
  title.innerHTML = 'TicTacToe'
  for (const e of cell) {
    e.innerHTML = ''
  }
})

clearStatsButton.addEventListener('click', () => {
  localStorage.clear();
  xStat.innerHTML = 0;
  oStat.innerHTML = 0;
  drawStat.innerHTML = 0;
})

!localStorage.getItem('X') ? xStat.innerHTML = 0 : xStat.innerHTML = localStorage.getItem('X');
!localStorage.getItem('O') ? oStat.innerHTML = 0 : oStat.innerHTML = localStorage.getItem('O');
!localStorage.getItem('Draw') ? drawStat.innerHTML = 0 : drawStat.innerHTML = localStorage.getItem('Draw');

// ==========================================

function data() {
  let gamedata = [];
  for (const i of cell) {
    gamedata.push(i.innerHTML)
  }
  return gamedata;
}

// ==========================================

function countMoves() {
  return(data().filter(e => e !== '').length)
}

// ==========================================

function checkWin(data) {
  let x = ['x', 'x', 'x'];
  let o = ['o', 'o', 'o'];
  for (const comb of winCombinations) {
    let combination = [];
    for (const i of comb) {
      combination.push(data[i])
    }
    let checkX = x.every((val, index) => val === combination[index]);
    let checkO = o.every((val, index) => val === combination[index])
    if(checkX) {
      return('X');
    } else if(checkO) {
      return('O')
    }
  }
  return(false);
}

// ==========================================

function checkDraw() {
  return(data().filter(e => e !== '').length == 9 && !checkWin(data()))
}

// ==========================================

function empty() {
  let emptySpots = []
  for (const i in data()) {
    if(data()[i] == '') {
      emptySpots.push(parseInt(i));
    }
  }
  return(emptySpots);
}

// ==========================================

function computerMove() {
  let emptySpots = empty();
  let gamedata = data();
  
  if(gamedata[4] != 'x' && gamedata[4] != 'o') return(4)

  if(calculateMove('o')) return(calculateMove('o'))
  if(calculateMove('x')) return(calculateMove('x'))

  if((gamedata[0] == 'x' && gamedata[8] == 'x') || (gamedata[2] == 'x' && gamedata[6] == 'x')) {
    let availiable = [1, 3, 5, 7].filter(x => emptySpots.includes(x));
    return(availiable[Math.floor(Math.random()*availiable.length)])
  }
  let availiable = [0, 2, 6, 8].filter(x => emptySpots.includes(x));
  let randomMove = availiable[Math.floor(Math.random()*availiable.length)];
  let move = availiable.length == 0 ? (emptySpots[Math.floor(Math.random()*emptySpots.length)]) : randomMove;
  return move;
}

// ==========================================

function calculateMove(item) {
  for (const i of empty()) {
    let board = [...data()];
    board[i] = item;
    if(checkWin(board)) return(i.toString());
  }
  return(false);
}

// ==========================================

function updateStats(item) {
  if(item == 'Draw') {
    if(!localStorage.getItem('Draw')) { localStorage.setItem('Draw', 0) }
    let draw = parseInt(localStorage.getItem('Draw'))
    localStorage.setItem('Draw', ++draw);
    drawStat.innerHTML = localStorage.getItem('Draw')
  } else if(item == 'X') {
    if(!localStorage.getItem('X')) { localStorage.setItem('X', 0) }
    let x = parseInt(localStorage.getItem('X'))
    localStorage.setItem('X', ++x);
    xStat.innerHTML = localStorage.getItem('X')
  } else if(item == 'O') {
    if(!localStorage.getItem('O')) { localStorage.setItem('O', 0) }
    let o = parseInt(localStorage.getItem('O'))
    localStorage.setItem('O', ++o);
    oStat.innerHTML = localStorage.getItem('O')
  }
}

// ==========================================

function cellClick() {
  while(countMoves() != 9) {
    if(!this.innerHTML && !checkWin(data())) {
      this.innerHTML = player;
    } else {
      return
    }
    if(checkWin(data())) break;
    if(countMoves() < 8) cell[computerMove()].innerHTML = computer;
    if(checkWin(data())) break;
  }

  if(checkDraw()) {
    title.innerHTML = 'Draw!'
    updateStats('Draw')
    return
  }

  if(checkWin(data())) {
    title.innerHTML = checkWin(data()) + ' won!'
    updateStats(checkWin(data()))
    return
  }
}
