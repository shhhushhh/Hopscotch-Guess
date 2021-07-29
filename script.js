/* global
 *    background, createCanvas, ellipse, stroke, rect, fill, colorMode, HSB,
 *    width, height, noStroke, textAlign, CENTER, text, mouseX, mouseY, LEFT
 */

let backgroundColor, player, blocks, score, gameOver, map

function setup() {
  // Canvas & color settings
  createCanvas(500, 300);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 95;
  score = 0;
  gameOver = false;
  
  blocks = [];
  
  map = [[0, 0, 1, 1, 1, 0, 0, 0, 1, 1],
         [1, 0, 1, 1, 1, 0, 1, 0, 0, 1],
         [0, 0, 1, 0, 0, 0, 1, 1, 0, 1],
         [0, 1, 1, 0, 1, 0, 1, 0, 0, 1],
         [0, 0, 0, 0, 1, 1, 1, 0, 0, 0] 
  ]
  
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] == 0) {
        if ((i == 0 && j == 0) || (i == map.length - 1 && j == map[0].length - 1)) {
          blocks.push(new Block(50 * j, 50 * i, 0, 117, true));
        } else {
          blocks.push(new Block(50 * j, 50 * i, 0, 2, false));
        }
      } else {
        blocks.push(new Block(50 * j, 50 * i, 1, 2, false));
      }
    }
  }
  
  player = new Player(blocks[0]);
  
}

function draw() {
  background(backgroundColor);
  for (let i = 0; i < blocks.length; i++) {
    blocks[i].showSelf();
  }
  finishLine();
  player.showSelf();
  if ((player.playerGuesses[player.playerGuesses.length - 1].x == width - 50 
     && player.playerGuesses[player.playerGuesses.length - 1].y == height - 100)
     || (player.lives <= 0)) {
    console.log("game end");
    gameIsOver();
  }
  scoreDisplay();
  livesDisplay();
}

function gameIsOver() {
  gameOver = true;
  for (let i = 0; i < blocks.length; i++) {
    blocks[i].hideSelf();
  }
  noStroke();
  textAlign(CENTER);
  fill(0);
  text(`GAME OVER`, width / 2, height / 2 - 20);
}

function mousePressed() {
  if (gameOver) {
    return;
  }
  player.x = mouseX;
  player.y = mouseY;
  player.updatePlayerGuesses();
}

function finishLine() { 
  noStroke();
  fill(100);
  textAlign(CENTER);
  text('END', width - 25, height - 70);
}

function scoreDisplay() {
  noStroke();
  fill(0);
  textAlign(LEFT);
  text(`Score: ${player.score}`, 10, 270);
}

function livesDisplay() {
  noStroke();
  fill(0);
  textAlign(LEFT);
  text(`Lives Remaining: ${player.lives}`, 10, 285);
}

class Player {
  constructor(startBlock) {
    this.x = 25;
    this.y = 25;
    this.size = 10;
    this.color = 100;
    this.playerGuesses = [startBlock];
    this.score = 0;
    this.lives = 5;
  }
  
  showSelf() {
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
  
  updatePlayerGuesses() {
    for (let i = 0; i < blocks.length; i++) { // iterates through the entire blocks array
      if (blocks[i].x < this.x && (blocks[i].x + 50) > this.x
         && blocks[i].y < this.y && (blocks[i].y + 50) > this.y) { // checks if the mouse click is within a block's x and y parameters
        let prevBlock = this.playerGuesses[this.playerGuesses.length - 1];
          if ((prevBlock.x == blocks[i].x && prevBlock.y == blocks[i].y + 50) // checks if previous block is below current block (going north)
             || (prevBlock.x == blocks[i].x && prevBlock.y == blocks[i].y - 50) // checks if previous block is above current block (going south)
             || (prevBlock.x == blocks[i].x + 50 && prevBlock.y == blocks[i].y) // checks if previous block is on the right of current block (going west)
             || (prevBlock.x == blocks[i].x - 50 && prevBlock.y == blocks[i].y)) { // checks if previous block in on the left of current block (going east)
            blocks[i].updateSelf();
            this.playerGuesses.push(blocks[i]); 
            console.log(this.playerGuesses);
          }
      } 
    }
  }
}

class Block {
  constructor(x, y, correct, color, show) {
    this.x = x;
    this.y = y;
    this.size = 50;
    this.color = color;
    this.correct = correct; // integers: 0 for true, 1 for false
    this.show = show;
  }
  
  showSelf() {
    if (this.show) {
      fill(this.color, 50, 80);
    } else {
      fill(0);
    }
    stroke(100);
    rect(this.x, this.y, this.size, this.size);
  }
  
  hideSelf() {
    this.color = backgroundColor;
    this.show = true;
  }
  
  updateSelf() {
    if (this.correct == 0) {
      this.color = 117;
      if (!player.playerGuesses.includes(this)) {
        player.score++;
      }
    } else if (this.correct == 1) {
      console.log("losing a life");
      player.lives--;
    }
    this.show = true;
  }
}
