let rain = [];
let heavy;
let currentTime;
let lastTime;
let timer = 0;

class Drop {
  constructor(weatherPos, p5) {
    this.p5 = p5;
    //this.p5.width * 0.5, this.p5.width
    //250, 500
    // Here you set where the drops should begin
    this.x = this.p5.random(
      weatherPos[0] - this.p5.width * 0.2,
      weatherPos[0] + this.p5.width * 0.2
    );
    this.y = this.p5.random(
      weatherPos[1] + this.p5.height * 0.05,
      weatherPos[1] + this.p5.height * 0.2
    );
    this.z = this.p5.random(0, 30);
    this.w = this.p5.random(3);
    this.h = this.p5.map(this.z, 0, 20, 10, 20);
    this.vel = this.p5.map(this.z, 0, 3, 0.5, 2);
    this.wind = 3;
  }

  update(windForce) {
    this.wind = windForce;
    this.y += this.vel;
    this.x -= this.wind;
  }

  show(weatherType) {
    this.p5.noStroke();
    this.p5.rotate(this.p5.PI / this.wind);
    let c;
    if (weatherType == 'rain') {
      c = this.p5.color(180, 170, 220, 150);
      this.p5.rect(this.x, this.y, this.w, this.h);
    }
    if (weatherType == 'snow') {
      c = this.p5.color(255);
      this.p5.circle(this.x, this.y, this.w);
    }
    this.p5.fill(c);
  }
}

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
  } /**/

  for (let i = rain.length - 1; i >= 0; i--) {
    if (rain[i].y > p5.height) {
      rain.splice(i, 1);
    } else {
      rain[i].update(1);
      rain[i].show(weatherType);
    } /**/
  }
}

function generateDrops(min, max, weatherPos, p5) {
  for (let i = min; i < max; i++) {
    let drop = new Drop(weatherPos, p5);
    rain.push(drop);
  }
}
