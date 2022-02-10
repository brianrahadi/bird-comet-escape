var canvas = document.getElementById("demoCanvas");
var context = canvas.getContext("2d");
context.canvas.width  = window.innerWidth - 20;
context.canvas.height = window.innerHeight - 20;

canvas.style.border = "10px solid brown";
canvas.style.backgroundColor = "black";
document.body.style.margin = 0;

const resetGame = (score) => {
  window.alert('Game over! your score is ' + score);
  window.location.reload();
}

class Bird {
  constructor(x, y, vx, vy, ay, radius, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.ay = ay;
    this.radius = radius;
    this.color = color;
  }
  render() {
    context.fillStyle = this.color;
    context.lineWidth = 2;

    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fill();
  }

  movingBird() {
    this.vy += this.ay;
    this.y += this.vy;
  }
  
  handleKeyDown = (evt) => {
    switch (evt.keyCode) {
      case 37: // left arrow
        this.x -= 10;
        break;
      case 32: // space arrow
        this.ay *= -1;
        break;
      case 39: // right arrow
        this.x += 10;
    }
  }

  detectWallColision(score) {
    // I allow some room for error because sometimes, the number may reach even though the frame has not been updated.
    if (this.y - this.radius <= -15 || this.y + this.radius >= canvas.height + 15) {
        resetGame(score);
    }
  }
}

class Comet {
  constructor(vx, vy, ay, y, radius, color) {
    this.x = canvas.width;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.ay = ay;
    this.radius = radius;
    this.color = color;
  }
  render() {
    context.fillStyle = this.color;
    context.lineWidth = 2;

    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fill();
  }

  movingComet() {
    this.vy += this.ay;
    this.x += this.vx;
    this.y += this.vy;
  }

  detectWallColision() {
    if (this.y - this.radius <= 0) {
        this.vy = Math.abs(this.vy); // do not use  *= -1 as infinite bounce may happen
    } else if (this.y + this.radius >= canvas.height) {
      this.vy = -Math.abs(this.vy);
    }
  }
}

class Score {
  constructor() {
    this.score = 0;
  }

  render() {
    context.fillStyle = 'white'
    context.fillText(this.score, canvas.width / 2, 30)
    context.fillText('Play with Space, Left, and Right Arrow Key!', canvas.width / 2, canvas.height - 20)
  }
}

const addComet = (comets) => {
  let vx = -20 - Math.floor(Math.random() * 10);
  let vy = Math.floor((Math.random() - 0.5) * 10)
  let ay = Math.floor((Math.random() - 0.5) * 5);
  let y = Math.floor(Math.random() * (canvas.height - 10));
  let radius = 30 + Math.floor(Math.random() * 10);
  let color = `rgb(
    ${Math.floor(Math.random() * 255)},
    ${Math.floor(Math.random() * 255)},
    ${Math.floor(Math.random() * 255)})`;
  
  comets.push(new Comet(vx, vy, ay, y, radius, color));
}
// end of declaring class and functions

context.font = "32px 'Times New Roman'";
context.textAlign = 'center'
let score = new Score();
let bird = new Bird(75, canvas.height / 2, 0, 1, 5, 25, 'blue')

let comets = []

setInterval(() => addComet(comets), 1000)

window.addEventListener('keydown', bird.handleKeyDown);

main();

function main() {
  startGame();
}

function startGame() {
  updateGame();
  window.requestAnimationFrame(drawGame);
}

function updateGame() {
  for (let i = 0; i < comets.length; i++) {
    let dx = comets[i].x - bird.x;
    let dy = comets[i].y - bird.y;
  
    let distance = Math.sqrt(dx * dx + dy * dy)
    let radiusDist = comets[i].radius + bird.radius;
    if (distance < radiusDist) {
      resetGame(score.score);
    }
    comets[i].movingComet();
    comets[i].detectWallColision();
  }
  bird.movingBird();
  bird.detectWallColision(score.score);
  score.score += 100;

  window.setTimeout(updateGame, 100);
}

function drawGame() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < comets.length; i++) {
    comets[i].render();
  }
  bird.render();
  score.render();
  
  window.requestAnimationFrame(drawGame);
}