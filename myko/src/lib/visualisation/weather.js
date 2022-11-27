let drops = [];
let accelerationDiff;
let precipitationSize, weatherPos, dropSize, weatherSize;
let weatherCloud;

export class Drop {
  constructor(weatherType, weatherPos, cloudSize, dropSize, accDiff, p5) {
    this.p5 = p5;
    this.weather = weatherType;
    this.size = cloudSize;
    this.weatherPos = weatherPos;
    this.startPos = this.p5.createVector(
      this.p5.random(weatherPos[0] - this.size * 0.35, weatherPos[0] + this.size * 0.35),
      this.p5.random(weatherPos[1], weatherPos[1] + this.p5.height * 0.25),
      this.p5.random(0, 30)
    );
    this.pos = this.startPos.copy();
    this.cloudPos = this.p5.createVector(weatherPos[0], weatherPos[1]);
    this.w = this.p5.map(this.startPos.z, 0, 30, 0.4 * dropSize, 1.3 * dropSize);
    this.h = this.p5.map(this.startPos.z, 0, 30, 14 * dropSize, 7 * dropSize);
    this.acc = 1;
    this.accDiff = accDiff;
    this.vel = this.p5.createVector(0, 0);
    this.wind = 2;
    this.alpha = this.p5.map(this.startPos.z, 0, 40, 0.2, 1);
  }

  update(windForce) {
    this.wind = windForce;
    this.vel.y = this.p5.map(this.pos.z, 0, 30, this.acc, this.acc * this.accDiff);
    this.pos.add(this.vel);
    this.pos.x -= this.wind;
  }

  show() {
    this.p5.noStroke();
    this.p5.rotate(this.p5.PI / this.wind);
    let c;
    if (this.weather === 'rain') {
      c = this.p5.color(200, 30, 65, this.alpha * 0.75);
      this.p5.rect(this.pos.x, this.pos.y, this.w, this.h, this.w * 0.5);
      this.acc = 8;
    }
    if (this.weather === 'snow') {
      c = this.p5.color(200, 0, 100, this.alpha);
      this.p5.circle(this.pos.x, this.pos.y, this.w * 1.75);
    }
    this.p5.fill(c);
  }

  edge() {
    if (this.pos.y > this.p5.height) {
      this.startPos.x = this.p5.random(
        this.weatherPos[0] - this.size * 0.35,
        this.weatherPos[0] + this.size * 0.35
      );
      this.startPos.y = this.p5.random(
        this.weatherPos[1],
        this.weatherPos[1] + this.p5.height * 0.18
      );
      this.pos.set(this.startPos);
    }
  }
}

export function prepareWeather(snow, rain, imgPos, cloud, dropS, p5, xtraCnvs) {
  dropSize = dropS;
  weatherSize = imgPos[2];
  // Snows in absence of cats
  if (snow) {
    weatherPos = imgPos[1];
    accelerationDiff = 2;
    weatherCloud = cloud[1];
    makeWeather('snow', p5, xtraCnvs);
  }
  // Rains in absence of tools
  if (rain) {
    weatherPos = imgPos[0];
    accelerationDiff = 8.5;
    weatherCloud = cloud[0];
    makeWeather('rain', p5, xtraCnvs);
  }
  return drops;
}

function makeWeather(weatherType, p5, xtraCnvs) {
  precipitationSize = dropSize * 0.0375;
  xtraCnvs.imageMode(xtraCnvs.CENTER);
  xtraCnvs.image(weatherCloud, weatherPos[0], weatherPos[1], weatherSize[0], weatherSize[1]);
  for (let i = 0; i < 220; i++) {
    drops.push(
      new Drop(weatherType, weatherPos, weatherSize[0], precipitationSize, accelerationDiff, p5)
    );
  }
  return drops;
}
