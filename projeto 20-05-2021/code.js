const canvas = document.querySelector("canvas");

const context = canvas.getContext("2d");

const marcusPng = new Image();

marcusPng.src =
  "https://cdn.discordapp.com/attachments/735961366355116113/847594645889220649/DPMZTcaW0AE2U6R.jpg";

function Player(color, p2 = false) {
  this.dir = 0;

  this.color = color;

  this.speed = 3;
  this.w = 50;
  this.h = 200;

  this.x = p2 ? canvas.width - 20 - this.w : 20;
  this.y = canvas.height / 2 - this.h / 2;

  this.draw = () => {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.w, this.h);
  };

  this.update = () => {
    // para cima dir = -1
    if (this.y <= 10) {
      this.dir = this.dir !== -1 ? this.dir : 0;
    }

    if (this.y >= canvas.height - 10 - this.h) {
      this.dir = this.dir !== 1 ? this.dir : 0;
    }

    let speed = this.speed;

    if (this.dir === -1) {
      speed = this.y - 10 > this.speed ? this.speed : this.y - 10;
    } else if (this.dir === 1) {
      speed =
        canvas.height - this.h - this.y - 10 > this.speed
          ? this.speed
          : canvas.height - this.h - this.y - 10;
    }

    this.y += this.dir * speed;
  };
}

function Ball(color) {
  this.spawned = false;
  this.size = 25;
  this.speed = 2;
  this.dirx = 0;
  this.diry = 0;
  this.x = canvas.width / 2 - this.size / 2;
  this.y = canvas.height / 2 - this.size / 2;
  this.color = color;

  this.spawn = () => {
    const dirx = Math.round(Math.random() * (2 - 1) + 1);
    const diry = Math.round(Math.random() * (2 - 1) + 1);
    this.dirx = dirx === 2 ? -1 : dirx;
    this.diry = diry === 2 ? -1 : diry;
    this.spawned = true;
  };

  this.draw = () => {
    context.translate(this.x, this.y);
    context.beginPath();
    // context.drawImage(marcusPng, 0, 0, this.size, this.size);
    context.fillStyle = "purple";
    context.fillRect(0, 0, this.size, this.size);
    context.closePath();
    context.translate(-this.x, -this.y);
  };

  this.update = () => {
    if (this.y <= 10 || this.y >= canvas.height - 10 - this.size) {
      this.diry = -this.diry;
    }

    if (this.x <= 10 || this.x >= canvas.width - 10 - this.size) {
      this.dirx = -this.dirx;
    }

    this.x += this.speed * this.dirx;
    this.y += this.speed * this.diry;
  };
}

const player1 = new Player("white");
const player2 = new Player("red", true);

const ball = new Ball("purple");

function draw() {
  context.fillStyle = "#282c34";
  context.fillRect(0, 0, canvas.width, canvas.height);
  // context.filter = "blur(5px)";
  // context.drawImage(background, -200, -50);
  // context.filter = "none";
  player1.draw();
  player2.draw();
  ball.draw();
}

const update = () => {
  ball.update();
  player1.update();
  player2.update();
  draw();

  // requestAnimationFrame(update);
};

setInterval(update, 0);

const handleKeyPressed = ({ key }) => {
  console.log(key);
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
  if (!ball.spawned) {
    if (key === " ") {
      ball.spawn();
    }
  }

  if (key === "w" || key === "s") {
    player1.dir = 0;
  }

  if (key === "ArrowUp" || key === "ArrowDown") {
    player2.dir = 0;
  }
};

window.addEventListener("keydown", handleKeyPressed);
window.addEventListener("keypress", handleKeyPressed);
window.addEventListener("keyup", handleKeyUp);
// w = 87
// s = 83

update();
