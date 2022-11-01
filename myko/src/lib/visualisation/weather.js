let rain = [];
let heavy;
let currentTime;
let lastTime;
let timer = 0;

class Drop {
  constructor(weatherPosition, p5) {
    this.p5 = p5;

    // Here you set where the drops should begin
    this.x = this.p5.random(weatherPosition[0], weatherPosition[1] + 250);
    this.y = this.p5.random(weatherPosition[0], weatherPosition[1]);
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

  draw(weatherType) {
    this.p5.noStroke();
    this.p5.rotate(this.p5.PI / this.wind);
    let c;
    if (weatherType == 'rain') {
      c = this.p5.color(180, 11, 86, 50);
      this.p5.rect(this.x, this.y, this.w, this.h);
    }
    if (weatherType == 'snow') {
      c = this.p5.color(255);
      this.p5.circle(this.x, this.y, this.w, this.h);
    }
    this.p5.fill(c);
  }
}

export function makeWeather(weatherType, weatherPosition, p5) {
  generateDrops(5, 30, weatherPosition, p5);
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
      rain[i].draw(weatherType);
    }
  }
}

function generateDrops(min, max, weatherPosition, p5) {
  for (let i = min; i < max; i++) {
    let drop = new Drop(weatherPosition, p5);
    rain.push(drop);
  }
}
