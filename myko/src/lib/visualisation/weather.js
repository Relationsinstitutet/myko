export default class Drop {
  constructor(weatherType, weatherPos, cloudSize, dropSize, p5) {
    this.p5 = p5;
    this.weather = weatherType;
    this.size = cloudSize;
    this.startPos = this.p5.createVector(
      this.p5.random(weatherPos[0] + this.size * 0.1, weatherPos[0] + this.size * 0.85),
      this.p5.random(weatherPos[1] + this.p5.height * 0.17, weatherPos[1] + this.p5.height * 0.22),
      this.p5.random(0, 30)
    );
    this.pos = this.startPos.copy();
    this.cloudPos = this.p5.createVector(weatherPos[0], weatherPos[1]);
    this.w = this.p5.map(this.startPos.z, 0, 30, 0.4 * dropSize, 1.3 * dropSize);
    this.h = this.p5.map(this.startPos.z, 0, 30, 4 * dropSize, 10 * dropSize);
    this.acc = 2;
    this.vel = this.p5.createVector(0, 0);
    this.wind = 2;
    this.alpha = this.p5.map(this.startPos.z, 30, 0, 0.3, 1);
  }

  update(windForce) {
    this.wind = windForce;
    this.vel.y = this.p5.map(this.pos.z, 0, 20, 1 * this.acc, 3 * this.acc);
    this.pos.add(this.vel);
    this.pos.x -= this.wind;
  }

  show() {
    this.p5.noStroke();
    this.p5.rotate(this.p5.PI / this.wind);
    let c;
    //this.p5.image(cloud, this.cloudPos.x, this.cloudPos.y, this.size, this.size);
    if (this.weather === 'rain') {
      c = this.p5.color(200, 30, 65, this.alpha);
      this.p5.rect(this.pos.x, this.pos.y, this.w, this.h);
      this.acc = 10;
    }
    if (this.weather === 'snow') {
      c = this.p5.color(200, 0, 100, this.alpha);
      this.p5.circle(this.pos.x, this.pos.y, this.w * 3);
      this.acc = 2;
    }
    this.p5.fill(c);
  }

  edge() {
    if (this.pos.y > this.p5.height) {
      this.pos.set(this.startPos);
    }
  }
}
