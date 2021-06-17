const canvas = document.querySelector("canvas");

const context = canvas.getContext("2d");

function Player(p2 = false) {
  this.dir = 0;

  this.speed = 4;
  this.w = 50;
  this.h = 200;

  this.x = p2 ? canvas.width - 20 - this.w : 20;
  this.y = canvas.height / 2 - this.h / 2;

  this.draw = () => {
    context.fillStyle = "#f2f2f2";
    context.fillRect(this.x, this.y, this.w, this.h);
  };

  this.update = () => {
    this.y += this.dir * this.speed;
  };
}

const player1 = new Player();
const player2 = new Player(true);

function draw() {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  player1.draw();
  player2.draw();
}

const update = () => {
  player1.update();
  player2.update();
  draw();
  requestAnimationFrame(update);
};

const handleKeyPressed = ({ key }) => {
  if (key === "w") {
    player1.dir = -1;
  } else if (key === "s") {
    player1.dir = 1;
  }

  if (key === "ArrowUp") {
    player2.dir = -1;
  } else if (key === "ArrowDown") {
    player2.dir = 1;
  }
};

const handleKeyUp = ({ key }) => {
  console.log(key);
  if (key === "w" || key === "s") {
    player1.dir = 0;
  }

  if (key === "ArrowUp") {
    player2.dir = -1;
  } else if (key === "ArrowDown") {
    player2.dir = 1;
  }
};

window.addEventListener("keydown", handleKeyPressed);
window.addEventListener("keypress", handleKeyPressed);
window.addEventListener("keyup", handleKeyUp);
// w = 87
// s = 83

update();
