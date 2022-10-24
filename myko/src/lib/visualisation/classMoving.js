//import Pictures from './class';

export class MovingPics /*extends Pictures*/ {
  constructor(type, size, typeName, p5, location, rotation, noiseScl) {
    //super(type, size, typeName);
    this.p5 = p5;
    this.type = type;
    this.size = size;
    this.typeName = typeName;
    this.pos = this.p5.createVector(location[0], location[1]);
    this.vel = this.p5.createVector(0, 0);
    this.acc = this.p5.createVector(0, 0);
    this.maxSpeed = 3;
    this.angle = 0;
    this.rotation = rotation;
    this.noiseScl = noiseScl;
  }

  shows(nr) {
    //if (this.typeName === 'planes') {}
    this.p5.push();
    this.p5.translate(this.pos.x, this.pos.y);
    this.p5.rotate(this.rotation);
    this.p5.rotate(this.angle);
    this.p5.image(this.type[nr % this.type.length], 0, 0, this.size, this.size);
    this.p5.pop();
  }

  update() {
    //let noiseScl = 25;
    let noiseStr = 2;
    let sclPos = this.p5.Vector.div(this.pos, this.noiseScl);
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

export class Particles {
  constructor(x, y, size, p5) {
    this.p5 = p5;
    this.pos = this.p5.createVector(x, y);
    this.vel = this.p5.createVector(this.p5.random(-0.25, 0.25), this.p5.random(-0.25, -0.4));
    this.size = size;
    this.alpha = 0.8;
    this.h = 35;
  }

  update() {
    this.pos.add(this.vel);
    this.alpha -= 0.005;
    this.size += 0.05;
  }

  show(nr, hue) {
    this.vel.y -= 0.001 * nr;
    this.h = hue;
    for (let i = 0; i < nr; i++) {
      this.p5.push();
      this.p5.noStroke();
      this.p5.fill(this.h, 88, 90, this.alpha);
      this.p5.circle(this.pos.x, this.pos.y, this.size);
      this.p5.pop();
    }
  }

  finished() {
    return this.alpha < 0;
  }
}
