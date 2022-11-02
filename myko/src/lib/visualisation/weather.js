/*let rain = [];
let heavy;
let currentTime;
let lastTime;
let timer = 0;*/

export default class Drop {
  constructor(weatherPos, p5) {
    this.p5 = p5;
    //this.p5.width * 0.5, this.p5.width
    //250, 500
    // Here you set where the drops should begin
    this.startPos = this.p5.createVector(
      this.p5.random(weatherPos[0] - this.p5.width * 0.15, weatherPos[0] + this.p5.width * 0.21),
      this.p5.random(weatherPos[1] + this.p5.height * 0.05, weatherPos[1] + this.p5.height * 0.2)
    );
    this.pos = this.startPos.copy();
    this.z = this.p5.random(0, 30);
    this.w = this.p5.map(this.z, 0, 30, 0.75, 2.5);
    this.h = this.p5.map(this.z, 0, 30, 10, 20);
    this.acc = 1;
    this.vel = this.p5.createVector(0, 0);
    this.wind = 2;
    this.alpha = this.p5.map(this.z, 0, 25, 245, 120);
  }

  update(windForce) {
    this.wind = windForce;
    this.vel.y = this.p5.map(this.z, 0, 3, 0.5 * this.acc, 1.5 * this.acc);
    this.pos.add(this.vel);
    this.pos.x -= this.wind;
  }

  show(weatherType) {
    this.p5.noStroke();
    this.p5.rotate(this.p5.PI / this.wind);
    let c;
    if (weatherType === 'rain') {
      c = this.p5.color(180, 170, 220, 150);
      this.p5.rect(this.pos.x, this.pos.y, this.w, this.h);
      this.acc = 1.5;
    }
    if (weatherType === 'snow') {
      c = this.p5.color(255, 255, 255, this.alpha);
      this.p5.circle(this.pos.x, this.pos.y, this.w * 2);
      this.acc = 0.5;
    }
    this.p5.fill(c);
  }

  edge() {
    if (this.pos.y > this.p5.height) {
      this.pos.set(this.startPos);
    }
  }
}

/* 
export function makeWeather(weatherType, weatherPos, p5) {
  generateDrops(5, 30, weatherPos, p5);
  lastTime = p5.millis();

  currentTime = p5.millis();
  timer += currentTime - lastTime;
  lastTime = currentTime;

  if (timer > 300) {
    heavy = p5.random(2, 30);
    generateDrops(heavy / 2, heavy * 2, weatherPos, p5);

    timer = 0;
  } 

  for (let i = rain.length - 1; i >= 0; i--) {
    if (rain[i].y > p5.height) {
      rain.splice(i, 1);
    } else {
      rain[i].update(1);
      rain[i].show(weatherType);
    } 
  }
}*/
/*
function generateDrops(min, max, weatherPos, p5) {
  for (let i = min; i < max; i++) {
    let drop = new Drop(weatherPos, p5);
    rain.push(drop);
  }
}*/
