//import Pictures from './class';

export default class MovingPics /*extends Pictures*/ {
  constructor(type, size, typeName, p5, location) {
    //super(type, size, typeName);
    this.p5 = p5;
    this.type = type;
    this.size = size;
    this.typeName = typeName;
    this.pos = this.p5.createVector(location[0], location[1]);
    this.vel = this.p5.createVector(0, 0);
    this.acc = this.p5.createVector(0, 0);
    this.maxSpeed = 4;
    this.angle = 0;
  }

  shows() {
    if (this.typeName === 'planes') {
      this.p5.push();
      this.p5.translate(this.pos.x, this.pos.y);
      this.p5.rotate(this.p5.HALF_PI);
      this.p5.rotate(this.angle);
      this.p5.image(this.type[0], 0, 0, this.size, this.size);
      this.p5.pop();
    }
  }

  update() {
    let noiseScl = 50;
    let noiseStr = 1;
    let sclPos = this.p5.Vector.div(this.pos, noiseScl);
    let path = this.p5.noise(sclPos.x, sclPos.y) * this.p5.TWO_PI * noiseStr;

    this.acc.x = this.p5.cos(path * 1.15);
    this.acc.y = this.p5.sin(path * 1.02);

    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.angle = this.vel.heading();
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  edge() {
    if (this.pos.x > this.p5.width) {
      this.pos.x = this.p5.random(this.p5.width * 0.15, this.p5.width * 0.85);
    }
    if (this.pos.x < 0) {
      this.pos.x = this.p5.random(this.p5.width * 0.15, this.p5.width * 0.85);
    }
    if (this.pos.y > this.p5.height) {
      this.pos.y = this.p5.random(this.p5.height * 0.15, this.p5.height * 0.85);
    }
    if (this.pos.y < 0) {
      this.pos.y = this.p5.random(this.p5.height * 0.15, this.p5.height * 0.85);
    }
  }
}
