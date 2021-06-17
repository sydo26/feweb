const canvas = document.querySelector("canvas");

const context = canvas.getContext("2d");

function Player(color, p2 = false) {
  this.dir = 0;

  this.color = color;

  this.speed = 3;
  this.w = 20;
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

function Ball(color, callback) {
  this.speedLimit = 12;
  this.rateLimit = 0.5;
  this.spawned = false;
  this.size = 25;
  this.speed = 4;
  this.dirx = 0;
  this.diry = 0;
  this.x = canvas.width / 2 - this.size / 2;
  this.y = canvas.height / 2 - this.size / 2;
  this.color = color;
  this.first = {
    p50: null,
    p100: null,
    p1000: null,
  };

  this.spawn = () => {
    this.x = canvas.width / 2 - this.size / 2;
    this.y = canvas.height / 2 - this.size / 2;
    const dirx = Math.round(Math.random() * (2 - 1) + 1);
    const diry = Math.round(Math.random() * (2 - 1) + 1);
    this.dirx = dirx === 2 ? -1 : dirx;
    this.diry = diry === 2 ? -1 : diry;
    this.spawned = true;
  };

  this.draw = () => {
    if (!this.spawned) {
      let text = "Press Space";

      context.font = `bolder 32px Segoe UI`;
      let textWidth = context.measureText(text).width;
      context.fillStyle = "white";
      context.save();
      let width = canvas.width / 2 - textWidth / 2;
      let height = canvas.height / 2 + 200;
      context.translate(width, height);

      context.fillText("Press SPACE", 0, 0);
      context.restore();
    }
    context.translate(this.x, this.y);
    context.beginPath();
    context.fillStyle = "purple";
    context.fillRect(0, 0, this.size, this.size);
    context.closePath();
    context.translate(-this.x, -this.y);
  };

  this.update = (p1, p2) => {
    if (this.first.p50 === -1) {
      p2.h -= 10;
      this.first.p50 = null;
    } else if (this.first.p50 === 1) {
      p1.h -= 10;
      this.first.p50 = null;
    }

    if (this.first.p100 === -1) {
      p2.h -= 15;
      this.first.p100 = null;
    } else if (this.first.p100 === 1) {
      p1.h -= 15;
      this.first.p100 = null;
    }

    if (this.first.p1000 === -1) {
      p2.h -= 20;
      this.first.p1000 = null;
    } else if (this.first.p1000 === 1) {
      p1.h -= 20;
      this.first.p1000 = null;
    }

    const yP1Ok = p1.y < this.y + this.size && p1.y + p1.h > this.y;
    const yP2Ok = p2.y < this.y + this.size && p2.y + p2.h > this.y;

    // player1
    if (p1.w + p1.x >= this.x && yP1Ok) {
      this.dirx = -this.dirx;
      if (this.speed + this.rateLimit <= this.speedLimit) {
        this.speed += this.rateLimit;
      }
    }

    // player2
    if (p2.x <= this.x + this.size && yP2Ok) {
      this.dirx = -this.dirx;
      if (this.speed + this.rateLimit <= this.speedLimit) {
        this.speed += this.rateLimit;
      }
    }

    if (this.y <= 10 || this.y >= canvas.height - 10 - this.size) {
      this.diry = -this.diry;
    }

    if (this.x <= 10 || this.x >= canvas.width - 10 - this.size) {
      callback(this.spawn, this.dirx);
    }

    let speed = this.speed;
    if (this.dirx === -1 && yP1Ok) {
      let distance = this.x - (p1.x + p1.w);
      speed = this.x - this.speed < p1.x + p1.w ? distance : this.speed;
    } else if (this.dirx === 1 && yP2Ok) {
      let distance = p2.x - (this.x + this.size);
      speed = this.x + this.size + this.speed > p2.x ? distance : this.speed;
    }

    this.x += speed * this.dirx;
    this.y += this.speed * this.diry;
  };
}

function Scoreboard() {
  this.points = {
    player1: 0,
    player2: 0,
  };

  this.title = "Scoreboard";
  this.color = "white";
  this.player1UI = "Player 1";
  this.player2UI = "Player 2";

  this.x = canvas.width / 2;
  this.y = 50;

  this.reset = () => {
    this.points = {
      player1: 0,
      player2: 0,
    };
  };

  this.addToPlayer1 = (points) => {
    this.points.player1 += points;
    if (this.points.player1 === 10 && ball.first.p50 === null) {
      ball.first.p50 = -1;
    } else if (this.points.player1 === 100 && ball.first.p100 === null) {
      ball.first.p100 = -1;
    } else if (this.points.player1 === 1000 && ball.first.p1000 === null) {
      ball.first.p1000 = -1;
    }
  };

  this.addToPlayer2 = (points) => {
    this.points.player2 += points;
    if (this.points.player2 === 50 && ball.first.p50 === null) {
      ball.first.p50 = 1;
    } else if (this.points.player2 === 100 && ball.first.p100 === null) {
      ball.first.p100 = 1;
    } else if (this.points.player2 === 1000 && ball.first.p1000 === null) {
      ball.first.p1000 = 1;
    }
  };

  this.draw = () => {
    context.textAlign = "middle";
    context.translate(this.x, this.y);
    context.fillStyle = this.color;
    context.font = "bolder 32px Segoe UI";
    let titleWidth = context.measureText(this.title).width;
    context.fillText(this.title, -titleWidth / 2, 0);

    let player1UIWidth = context.measureText(this.player1UI).width;
    let player2UIWidth = context.measureText(this.player2UI).width;
    context.font = "bolder 16px Segoe UI";
    context.fillText(this.player1UI, -player1UIWidth / 4 - 200, 10);
    context.fillText(this.player2UI, -player2UIWidth / 4 + 200, 10);

    context.font = "bolder 24px Segoe UI";
    let p1PointText = `${this.points.player1} ponto${
      this.points.player1 > 1 || this.points.player1 === 0 ? "s" : ""
    }`;
    let p2PointText = `${this.points.player2} ponto${
      this.points.player2 > 1 || this.points.player2 === 0 ? "s" : ""
    }`;

    let p1PointTextWidth = context.measureText(p1PointText).width;
    let p2PointTextWidth = context.measureText(p1PointText).width;
    context.fillText(p1PointText, -p1PointTextWidth / 2 - 200, 36);
    context.fillText(p2PointText, -p2PointTextWidth / 2 + 200, 36);

    context.translate(-this.x, -this.y);
  };
}

const player1 = new Player("white");
const player2 = new Player("red", true);

const scoreboard = new Scoreboard();

const pointIncrement = 10;

function respawnEvent(spawn, dirx) {
  spawn();
  if (dirx === -1) {
    scoreboard.addToPlayer2(pointIncrement);
  } else {
    scoreboard.addToPlayer1(pointIncrement);
  }
}

const ball = new Ball("purple", respawnEvent);

function draw() {
  context.fillStyle = "#282c34";
  context.fillRect(0, 0, canvas.width, canvas.height);
  player1.draw();
  player2.draw();
  ball.draw();
  scoreboard.draw();
}

const update = () => {
  ball.update(player1, player2);
  player1.update();
  player2.update();
  draw();

  requestAnimationFrame(update);
};

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
// setInterval(() => {
//   update();
// }, 200);
