// Creating variables

updates = 0;
originalArr = [];
putToDraw = [];
offset = -100;
grass = new Image();
isWalking = false;
blockwall = new Image();
blocks = 256;

blockwall.src = "blockwall.png";
grass.src =
  "https://lh3.googleusercontent.com/J2NRVx0rC1EfAcG3qNVWNMUuMMu12yLnwuZiuP-ZuaKCND7hDNND0B7o-ZydeTZvQ_pZYS8UDfYHWR-o7b09=s400";
stone = new Image();
stone.src =
  "https://www.craftycreations.net/wp-content/uploads/2019/08/Stone-Block-600x600.png";
dirt = new Image();
dirt.src =
  "https://static.planetminecraft.com/files/image/minecraft/texture-pack/2021/730/14974571-dirtpack_m.jpg";
leg = new Image();
leg.src = "leg.png";
body = new Image();
body.src = "body.png";
head = new Image();
head.src = "head.png";
function snapToNearest(coordinate) {
  return Math.round(coordinate / 30) * 30;
}
function lerp(n, a, b) {
  return n * (b - a) + a;
}
class player {
  xSpeed = 0;
  xAccel = 0;
  x = 0;
  trueX = 0;
  constructor() {}
  update() {
    this.xSpeed += this.xAccel;
    this.x += this.xSpeed;
    if (Math.abs(this.xSpeed) > 5) {
      this.xSpeed = Math.sign(this.xSpeed) * 5;
    }
    if (isKeyPressed[68]) {
      this.xAccel = -0.3;
    }
    if (isKeyPressed[65]) {
      this.xAccel = 0.3;
    }
    if (!isKeyPressed[65] && !isKeyPressed[68]) {
      this.xSpeed = 0;
      this.xAccel = 0;
    }
    this.trueX = this.x / 30;
  }
}
oeo = new player();
class noise {
  ogArray = [];
  noise = [];
  blocks = [];
  chunks = [];

  constructor() {
    for (let i = 0; i < 4; i++) {
      this.chunks[i] = [];
      for (let j = 0; j < 16; j++) {
        this.chunks[i][j] = [];
        for (let k = 0; k < 16; k++) {
          this.chunks[i][j][k] = { type: "air" };
        }
      }
    }
  }
  // lerpBetweenSamples(arr, sampleSize) {
  //   for (let j = 0; j < arr.length - sampleSize; j += sampleSize) {
  //     for (let i = j; i < j + sampleSize; i++) {
  //       console.log(i / (j + sampleSize));
  //       arr[i] = lerp(i / (j + sampleSize), arr[i], arr[j + sampleSize]);
  //     }
  //   }
  // }

  sample(n, arr) {
    let resultingarr = [];
    let lastsaved = 0;
    for (let i = 0; i < arr.length; i++) {
      // console.log(lastsaved);
      if (i % n == 0) {
        lastsaved = i;
        resultingarr[i] = arr[i];
      } else {
        if (arr[lastsaved + n] != undefined) {
          resultingarr[i] = lerp(
            (i - lastsaved) / n,
            arr[lastsaved],
            arr[lastsaved + n]
          );
        } else {
          resultingarr[i] = lerp(
            i / (arr.length - 1),
            arr[lastsaved],
            arr[arr.length - 1]
          );
        }
        // console.log(
        //   lerp(
        //     i / (lastsaved + n),
        //     resultingarr[i],
        //     resultingarr[lastsaved + i]
        //   )
        // );
        //resultingarr[i] = 0;
      }
    }
    // this.lerpBetweenSamples(resultingarr, n);
    return resultingarr;
  }
  makenoise() {
    this.ogArray = [];
    for (let i = 0; i < blocks; i++) {
      this.ogArray[i] = Math.random() * 8 - 4;
      this.blocks[i] = { x: i * 30 + 200, y: 0 };
    }
    for (let i = 0; i < blocks; i++) {
      this.noise[i] = 0;
    }
    this.makeOctaves();
  }
  makeOctaves() {
    for (let i = 16; i > 2; i /= 2) {
      let emida = this.sample(i, this.ogArray);
      for (let j = 0; j < this.noise.length; j++) {
        this.noise[j] += (i / 16) * emida[j];
      }
    }
    for (let i = 0; i < blocks; i++) {
      this.blocks[i].y = snapToNearest(lolnoise.noise[i] * 30 + 200);
    }
    for (let j = 0; j < blocks; j++) {
      for (let i = 0; i < 5; i++) {
        this.blocks.push({
          x: j * 30 + 200,
          y: snapToNearest(this.noise[j] * 30 + 200) + 30 * i,
        });
      }
    }
  }
}
lolnoise = new noise();
lolnoise.makenoise();
function update() {
  updates++;
  oeo.update();
}

function draw() {
  context.fillStyle = "#34b7eb";
  context.fillRect(0, 0, 1200, 1000);
  context.drawImage(blockwall, 0, 30 * 10);

  for (i = 0; i < lolnoise.blocks.length; i++) {
    // drawLine(
    //   (i + 1) * 30 + oeo.x,
    //   lolnoise.noise[i + 1] * 30 + 200,
    //   i * 30 + oeo.x,
    //   lolnoise.noise[i] * 30 + 200
    // );
    if (i % 8 == 0) {
      context.fillStyle = "red";
    }
    if (
      lolnoise.blocks[i].x - oeo.x > 0 &&
      lolnoise.blocks[i].x - oeo.x < 1000
    ) {
      context.drawImage(
        grass,
        lolnoise.blocks[i].x - oeo.x,
        lolnoise.blocks[i].y,
        30,
        30
      );
    }

    // drawLine(
    //   i * 30 + oeo.x,
    //   lolnoise.ogArray[i - 1] * 30 + 200,
    //   (i + 1) * 30 + oeo.x,
    //   lolnoise.ogArray[i] * 30 + 200
    // );
  }
  context.fillRect(500, 30 * 10, 30, 30);
}

function keyup(key) {
  // Show the pressed keycode in the console
  console.log("Pressed", key);
}

function mouseup() {
  for (i = 0; i < lolnoise.blocks.length; i++) {
    if (
      areColliding(
        mouseX,
        mouseY,
        5,
        5,
        lolnoise.blocks[i].x - oeo.x,
        lolnoise.blocks[i].y,
        30,
        30
      )
    ) {
      lolnoise.blocks.splice(lolnoise.blocks.indexOf(lolnoise.blocks[i]), 1);
      break;
    }
  }
  // Show coordinates of mouse on click
  console.log("Mouse clicked at", mouseX, mouseY);
}
