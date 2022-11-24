const canvasBody = document.getElementById('myCanvas');
const btnStart = document.getElementById('start');
const canvasWidth = canvasBody.width;
const canvasHeight = canvasBody.height;
const ctx = canvasBody.getContext('2d');

//圖形設置
//Ball
let circle_x = 160;
let circle_y = 60;
let radius = 20;
let speed_x = 20;
let speed_y = 20;
//Ground
let ground_x = 100;
let ground_y = 500;
let ground_width = 200;
let ground_height = 5;

let myGame;
let count = 0;
let bricks = [];

//Brick用function(x:0~950, y:0~550)
const getRandomNumber = function (min, max) {
  return min + Math.floor(Math.random() * (max - min));
};

//磚塊
class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.visible = true;
    bricks.push(this);
  }

  drawBrick() {
    ctx.fillStyle = 'lightgreen';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  alignNewPosition() {
    let overlap = false;
    let new_x;
    let new_y;

    const checkOverlap = function (new_x, new_y) {
      for (let i = 0; i < bricks.length; i++) {
        if (new_x === bricks[i].x && new_y === bricks[i].y)
          return (overlap = true);
      }
    };

    do {
      new_x = getRandomNumber(0, 950);
      new_y = getRandomNumber(0, 550);
      checkOverlap(new_x, new_y);
    } while (overlap);

    this.x = new_x;
    this.y = new_y;
  }

  touchBallOrNot(ball_x, ball_y) {
    return (
      ball_x >= this.x - radius &&
      ball_x <= this.x + this.width + radius &&
      ball_y >= this.y - radius &&
      ball_y <= this.y + this.height + radius
    );
  }
}
////////////////////////////////////////////////////////////

//製作Bricks
//先製作第一個
const makeBricks = function () {
  bricks[0] = new Brick(getRandomNumber(0, 950), getRandomNumber(0, 550));
  //再做剩下的
  for (let i = 1; i < 10; i++) {
    bricks[i] = new Brick(getRandomNumber(0, 950), getRandomNumber(0, 550));
    bricks[i].alignNewPosition();
  }
};

//讓板可以和滑鼠一起移動
canvasBody.addEventListener('mousemove', (e) => {
  ground_x = e.clientX;
});

//畫圖
const drawCircles = function () {
  //確認是否超過邊框

  if (circle_x > canvasWidth - radius) {
    speed_x *= -1;
    circle_x -= 10;
  }
  if (circle_x < radius) {
    speed_x *= -1;
    circle_x += 10;
  }
  if (circle_y > canvasHeight - radius) {
    speed_y *= -1;
    circle_y -= 10;
  }
  if (circle_y < radius) {
    speed_y *= -1;
    circle_y += 10;
  }

  //確認磚塊是否有被球打到
  bricks.forEach((b) => {
    if (b.visible === true && b.touchBallOrNot(circle_x, circle_y)) {
      //打到
      if (b.y >= circle_y || b.y + b.height <= circle_y) speed_y *= -1;
      else if (b.x >= circle_x || b.x + b.width <= circle_x) speed_x *= -1;

      //消除方塊（較耗資源）
      //bricks.splice(i, 1);
      //   if (bricks.length === 0) {
      //     alert('Game Complete!!');
      //     clearInterval(myGame);
      //     return;
      //   }

      //消除方塊（另法）
      b.visible = false;
      count++;
      if (count === 10) {
        alert('Game complete🏅');
        clearInterval(myGame);
        return;
      }
    }
  });
  //是否與板打到
  if (
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius &&
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + ground_width + radius
  ) {
    //避免球卡在桿子上
    if (speed_y > 0) {
      circle_y -= 25;
    } else {
      circle_y += 25;
    }

    speed_y *= -1;
  }

  //設定移動速度
  circle_x += speed_x;
  circle_y += speed_y;

  //初始黑背景
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  //畫方塊
  bricks.forEach((b) => {
    if (b.visible) b.drawBrick();
  });

  //畫板
  ctx.fillStyle = 'chocolate';
  ctx.fillRect(ground_x, ground_y, ground_width, ground_height);

  //畫圓
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'lightblue';
  ctx.fill();
};

btnStart.addEventListener('click', () => {
  count = 0;
  bricks = [];
  circle_x = 160;
  circle_y = 60;
  speed_x = 20;
  speed_y = 20;
  ground_x = 100;
  ground_y = 500;
  makeBricks();
  document.getElementById('rule').classList.add('hidden');
  if (myGame) clearInterval(myGame);
  myGame = setInterval(drawCircles, 25);
});
