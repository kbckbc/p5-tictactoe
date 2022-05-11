let bw;     // board width
let gw;    // grid width
let fontSize;
let fontColor;

const player = ['O','X']; // 'O' for human, 'X' for ai
let currPlayer;    // 0 : 'O', 1 : 'X'

const human = 0;
const ai = 1;

let numOfGame = 0;
let humanWin = 0;
let tieWin = 0;

let board = [];
// [0] : 'O' for human, 'X' for ai
// [1] : 'H', 'V', 'D', 
// [2] : line number

let selectLv;
let autoBtn;
let matchBtn;
let resultBtn;

let prevLv = 'Random';
let playMode = 1; // 0: auto, 1:mouse click
let oScoreTable = {
  'O':1,
  'X':-1,
  '-':0
};
let xScoreTable = {
  'X':1,
  'O':-1,
  '-':0
};


function windowResized() {
  initSize(windowWidth, windowHeight);
  resizeCanvas(bw, bw);
  selectLv.style('font-size',fontSize);
  autoBtn.style('font-size',fontSize);
  matchBtn.style('font-size',fontSize);
  resultBtn.style('font-size',fontSize);
}


function initSize(w, h){
  if( w > h) {
    bw = h - 100;
  }
  else {
    bw = w - 100;
  }  
  gw = bw/3;    // grid width
  fontSize = floor(bw/25) + 'px';
  fontColor = 'gray'; 
}


function setup() {
  initSize(windowWidth, windowHeight);
 
  createCanvas(bw, bw);
  frameRate(3);
  initGame();
}


function draw() {
  background(255);
  drawEmptyBoard(board);
  
  if(playMode == 0 || playMode == 1 && currPlayer == ai) {
    if(selectLv.value() == 'Random') {
      currPlayer = nextTurnRandom(currPlayer);  
    }
    else {
      currPlayer = nextTurnMinmax(currPlayer);    
    }
  }
  
  drawStone(board);
  
  let winner = checkWinner();
  if( winner != null) {
    drawWinningLine(board);
    let resultStr = '#' + ++numOfGame + ' Game winner is ' + winner;
    let p = createP(resultStr).style('color',fontColor).style('font-size',fontSize);
    noLoop();
  }
}


function checkWinner() {
  let result = whoIsWinner();
  if( result != null ) {
    if(result[0] == 'O') {
      humanWin++;
    }
    else if(result[0] == '-') {
      tieWin++;
    }
    return result[0];
  }  
  else {
    return null;
  }
}


function initGame() {
  board = [
  ['','',''],
  ['','',''],
  ['','','']
  ];  

  currPlayer = floor(random(player.length));
  // currPlayer = ai;
  console.log('initGame, playMode:' + playMode + ', currPlayer:' + currPlayer);

  initElements();
}


function initElements() {
  selectLv = createSelect().style('font-size',fontSize);;
  selectLv.option('Random');
  selectLv.option('Ai(min max)');
  selectLv.selected(prevLv);
  selectLv.changed(mySelectEvent);

  autoBtn = createButton('Auto play').style('font-size',fontSize);
  autoBtn.mousePressed(autoGame);
  
  matchBtn = createButton('Match play').style('font-size',fontSize);
  matchBtn.mousePressed(matchGame);
  
  resultBtn = createButton('Show result').style('font-size',fontSize);
  resultBtn.mousePressed(showResult);
  
  let p = createP('Choose a level and click to play').style('color',fontColor).style('font-size',fontSize);
}


function mySelectEvent() {
  prevLv = selectLv.value();
}

function autoGame() { startGame(0); }
function matchGame() { startGame(1); }
function startGame(m) {
  playMode = m;
  removeElements();
  initGame();
  loop();
}


function showResult() {
  let n = numOfGame;
  let h = humanWin;
  let c = numOfGame - humanWin - tieWin;
  let t = tieWin;
  
  let str = 'Total game #' + n + ', O : X : Tie = ' + h + ' : ' + c + ' : ' + t;
  let p = createP(str).style('color',fontColor).style('font-size',fontSize);
}


function drawEmptyBoard() {
  strokeWeight(5);
  line(gw,0,gw,height);
  line(gw*2,0,gw*2,height);
  line(0,gw,width,gw);
  line(0,gw*2,width,gw*2);
}


function drawStone(board) {
  for(let y=0; y < 3; y++) {
    for(let x=0; x < 3; x++) {
      stone = board[y][x];
      
      pX = x * gw + gw/2;
      pY = y * gw + gw/2;
      
      // console.log("x:" + x + ", y:" + y + ", stone:" + stone + ", pX:"+ pX + ", pY:" + pY);
      
      r = gw * 0.3; // radius
      
      if(stone == 'O') {
        noFill();
        ellipse(pX, pY, gw/2, gw/2);
      }
      else if(stone == 'X') {
        line(pX - r,pY - r, pX + r, pY + r);
        line(pX - r,pY + r, pX + r, pY - r);
      }
    }
  }
}


function drawWinningLine(board) {
  let winner = whoIsWinner();
  if( winner == null ) {
    return;
  }
  let w = winner[0];
  let d = winner[1];
  let n = winner[2];
  
  //console.log(d,n);
  
  strokeWeight(15);
  if(w == 'O') {
    stroke(color(0,255,0));  
  }
  else if(w == 'X') {
    stroke(color(255,0,0));  
  }
  
  if( d == 'V') {
    x1 = gw/2 + gw * n;
    y1 = gw/2;
    x2 = gw/2 + gw * n;
    y2 = gw/2 + gw * 2;
    line(x1, y1, x2, y2); 
  }
  else if( d == 'H') {
    x1 = gw/2;
    y1 = gw/2 + gw * n;
    x2 = gw/2 + gw * 2;
    y2 = gw/2 + gw * n;
    line(x1, y1, x2, y2); 
  }
  else if( d == 'D' && n == 0) {
    x1 = gw/2;
    y1 = gw/2;
    x2 = gw/2 + gw * 2;
    y2 = gw/2 + gw * 2;
    line(x1, y1, x2, y2); 
  }
  else if( d == 'D' && n == 1) {
    x1 = gw/2;
    y1 = gw/2 + gw * 2;
    x2 = gw/2 + gw * 2;
    y2 = gw/2;
    line(x1, y1, x2, y2); 
  }
  stroke(color(0,0,0));
}


function equal3(a,b,c) {
  return ( a == b && b == c && a != '');
}


// return null or list
// [0] : 'O' 'X' '-'
// [1] : 'V' 'H' 'D'
// [2] : 1 or 2 or 3
function whoIsWinner() {
  let winner = null;
  let dir;
  let line;

  // horizontal
  for(let i=0;i<3;i++) {
    if(equal3(board[i][0], board[i][1], board[i][2])) {
      winner = board[i][0];
      dir = 'H';
      line = i;
    }
  }
  
  // vertical
  for(let i=0;i<3;i++) {
    if(equal3(board[0][i], board[1][i], board[2][i])) {
      winner = board[0][i];
      dir = 'V';
      line = i;      
    }
  }
  
  // diagonal
  if( equal3(board[0][0], board[1][1], board[2][2]) ) {
    winner = board[1][1];
    dir = 'D';
    line = 0;
  }
  
  if( equal3(board[2][0], board[1][1], board[0][2]) ) {
    winner = board[1][1];
    dir = 'D';
    line = 1;
  }
  
  let cnt = 0;
  for(let y=0; y < 3; y++) {
    for(let x=0; x < 3; x++) {
      if(board[y][x] == '') {
        cnt++;
      }
    }
  }
  
  if(winner == null && cnt == 0) {
    winner = '-';
  }
  
  if( winner == null) {
    return null;
  }
  else {
    return [winner, dir, line];  
  }
  
}


function isBoardFull() {
  for(let y=0;y<3;y++) {
    for(let x=0;x<3;x++) {
      if(board[y][x] == '') {  
        return false;
      }
    }
  }
  
  return true;
}


function mousePressed() {
  if(playMode == 1 && currPlayer == human) {
    let x = floor(mouseX / gw);
    let y = floor(mouseY / gw);
    if (x < 0 || x > 2 || y < 0 || y > 2) return;

    if(board[y][x] == '') {
      board[y][x] = player[currPlayer];
      currPlayer = (currPlayer + 1) % player.length
    }
  }
}


function nextTurnRandom(turn) {
  // check are there any spot
  if(isBoardFull() == true) return turn;
  
  // make a decision
  let available = [];
  
  for(let y=0;y<3;y++) {
    for(let x=0;x<3;x++) {
      if(board[y][x] == '') {
        available.push({y,x});
      }
    }
  }
  let move = random(available);
  
  // make a move
  board[move.y][move.x] = player[turn];
  
  // return next turn
  return getNextTurn(turn);
}


function getNextTurn(turn) {
  return (turn + 1) % player.length; 
}


function myTurn(turn) {
  if( turn == 0 ) return 'O';
  else return 'X';s
}


function nextTurnMinmax(turn) {
  // check are there any spot
  if(isBoardFull() == true) return turn;
  
  // make a decision
  let bestScore = -Infinity;
  let bestMove;
  
  for(let y=0;y<3;y++) {
    for(let x=0;x<3;x++) {
      if(board[y][x] == '') {
        board[y][x] = player[turn];
        
        let score;
        if(myTurn(turn) == 'O') {
          score = minimax(board, getNextTurn(turn), false, oScoreTable);  
        }
        else {
          score = minimax(board, getNextTurn(turn), false, xScoreTable);
        }
        
        board[y][x] = '';
        
        if(score > bestScore) {
          bestScore = score;
          bestMove = {y,x};
        }        
      }
    }
  }
  
  // make a move
  board[bestMove.y][bestMove.x] = player[turn];
  
  // return next turn
  return getNextTurn(turn);
}


function minimax(board, turn, isMaximizing, scoreTable) {
  
  let winner = whoIsWinner();
  if(winner != null) {
    return scoreTable[winner[0]];  
  }
  
  if(isMaximizing == true) {
    let maxScore = -Infinity;
    
    for(let y=0;y<3;y++) {
      for(let x=0;x<3;x++) {
        if(board[y][x] == '') {
          board[y][x] = player[turn];
          let score = minimax(board, getNextTurn(turn), false, scoreTable);
          board[y][x] = '';     

          maxScore = max(score, maxScore);
        }
      }
    }
    
    return maxScore;
  } 
  else if(isMaximizing == false) {
    let minScore = Infinity;
    
    for(let y=0;y<3;y++) {
      for(let x=0;x<3;x++) {
        if(board[y][x] == '') {
          board[y][x] = player[turn];
          let score = minimax(board, getNextTurn(turn), true, scoreTable);
          board[y][x] = '';     

          minScore = min(score, minScore);
        }
      }
    }
    
    return minScore;
  }
}
