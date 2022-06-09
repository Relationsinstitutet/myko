export default class Particle {
  constructor(p5, x, y, h) {
    this.p5 = p5;
    this.pos = this.p5.createVector(x, y);
    this.vel = this.p5.createVector(0, 0);
    this.dir = this.p5.createVector(0, 0);
    this.speed = this.p5.random(0.3, 0.7); //
    this.h = h;
    this.l = this.p5.random(5, 20);
    this.noiseScl = 500;
    this.noiseStr = 2;
  }

  update() {
    let sclPos = this.p5.Vector.div(this.pos, this.noiseScl);
    //let anglea = noise(sclPos.x)*noiseStr;//* noiseStr
    let angleb = this.p5.noise(sclPos.x, sclPos.y) * this.noiseStr * this.p5.TWO_PI;
    this.dir.x = this.p5.cos(angleb);
    this.dir.y = this.p5.sin(angleb);
    this.vel.add(this.dir);
    this.vel.mult(this.speed);
    this.vel.limit(3);
    this.pos.add(this.vel);
  }

  show(w, s, h) {
    let col = this.p5.color(h, s, this.l, 0.5);
    this.p5.fill(col);
    this.p5.strokeWeight(w * 0.02);
    this.p5.stroke(col);
    this.p5.circle(this.pos.x, this.pos.y, w);
  }

  edge() {
    if (
      this.pos.x > this.p5.width * 1.1 ||
      this.pos.x < this.p5.width * -0.1 ||
      this.pos.y > this.p5.height * 1.1 ||
      this.pos.y < this.p5.height * -0.1
    ) {
      this.pos.x = this.p5.random(this.p5.width);
      this.pos.y = this.p5.random(this.p5.height);
    }
  }
} //end of Particle class!
