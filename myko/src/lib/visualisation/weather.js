let rain = [];
let heavy;
let currentTime;
let lastTime;
let timer = 0;

class Drop {
  constructor(p5) {
    this.p5 = p5;

    this.x = this.p5.random(this.p5.width * 0.5, this.p5.width + 50);
    this.y = this.p5.random(500, 250);
    this.z = this.p5.random(0, 30);
    this.w = this.p5.random(3);
    this.h = this.p5.map(this.z, 0, 20, 10, 20);
    this.vel = this.p5.map(this.z, 0, 3, 2, 3);
    this.wind = 3;
  }

  update(windForce) {
    this.wind = windForce;
    this.y += this.vel;
    this.x -= this.wind;
  }

  draw() {
    this.p5.noStroke();
    this.p5.rotate(this.p5.PI / this.wind);
    let c = this.p5.color(180, 11, 86, 50);
    //c = color(255); snow
    this.p5.fill(c);
    //circle(this.x, this.y, this.w, this.h); snow
    this.p5.rect(this.x, this.y, this.w, this.h);
  }
}

export function makeWeather(p5) {
  generateDrops(5, 30, p5);
  lastTime = p5.millis();

  currentTime = p5.millis();
  timer += currentTime - lastTime;
  lastTime = currentTime;

  if (timer > 300) {
    heavy = p5.random(0, 40);
    generateDrops(heavy / 2, heavy * 2, p5);

    timer = 0;
  }

  for (let i = 0; i < rain.length; i++) {
    if (rain[i].y > p5.height) {
      rain.splice(i, 1);
    } else {
      rain[i].update(1);
      rain[i].draw();
    }
  }
}

function generateDrops(min, max, p5) {
  for (let i = min; i < max; i++) {
    let drop = new Drop(p5);
    rain.push(drop);
  }
}
