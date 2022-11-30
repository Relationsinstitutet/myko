export default class Drop {
  constructor(weatherType, weatherPos, cloudSize, dropSize, accelerationDiff, p5) {
    this.p5 = p5;
    this.weather = weatherType;
    this.size = cloudSize;
    this.weatherPos = weatherPos;
    this.startPos = this.p5.createVector(
      this.p5.random(weatherPos[0] - this.size * 0.35, weatherPos[0] + this.size * 0.35),
      this.p5.random(weatherPos[1], weatherPos[1] + this.p5.height * 0.15),
      this.p5.random(0, 30)
    );
    this.pos = this.startPos.copy();
    this.cloudPos = this.p5.createVector(weatherPos[0], weatherPos[1]);
    this.w = this.p5.map(this.startPos.z, 0, 30, 0.4 * dropSize, 1.3 * dropSize);
    this.h = this.p5.map(this.startPos.z, 0, 30, 14 * dropSize, 7 * dropSize);
    this.varySize = 1.75;
    this.acc = 1.5;
    this.accDiff = accelerationDiff;
    this.vel = this.p5.createVector(0, 0);
    this.wind = 2;
    this.hue = 200;
    this.sat = 0;
    this.light = 100;
    this.alpha = this.p5.map(this.startPos.z, 0, 40, 0.3, 1);
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
      c = this.p5.color(this.hue, this.sat, this.light, this.alpha);
      this.p5.circle(this.pos.x, this.pos.y, this.w * this.varySize);

      let mouseDistance = this.p5.dist(this.p5.mouseX, this.p5.mouseY, this.pos.x, this.pos.y);
      if (mouseDistance < 10) {
        this.onHover();
      }
    }
    this.p5.fill(c);
  }

  onHover() {
    this.varySize = 3;
    this.light = 80;
    this.sat = 95;
    this.hue += 5;
  }

  edge() {
    if (this.pos.y > this.p5.height) {
      this.startPos.x = this.p5.random(
        this.weatherPos[0] - this.size * 0.35,
        this.weatherPos[0] + this.size * 0.35
      );
      this.startPos.y = this.p5.random(
        this.weatherPos[1],
        this.weatherPos[1] + this.p5.height * 0.15
      );
      this.pos.set(this.startPos);
    }
  }
}
