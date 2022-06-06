let noiseScale = 300;
//let noiseStr = 350;

export default class Particle {
  constructor(p5, x, y, c, a, n, s) {
    this.p5 = p5;
    this.pos = this.p5.createVector(x, y);
    this.changePos = this.pos.copy();
    this.vel = this.p5.createVector(0, 0);
    this.dir = this.p5.createVector(0, 0);
    this.speed = s; //random(0.3, 1.3)
    this.c = this.p5.color(c);
    this.c.setAlpha(this.p5.random(a, a * 2));
    this.noiseStr = n;
  }

  update() {
    let sclPos = this.p5.Vector.div(this.changePos, noiseScale);
    //let anglea = noise(sclPos.x)*noiseStr;//* noiseStr
    let angleb = this.p5.noise(sclPos.x, sclPos.y) * this.noiseStr * this.p5.TWO_PI;
    this.dir.x = this.p5.cos(angleb);
    this.dir.y = this.p5.sin(angleb);
    this.vel.add(this.dir);
    this.vel.mult(this.speed);
    this.vel.limit(3);
    this.changePos.add(this.vel);
  }

  show(w) {
    this.p5.strokeWeight(w);
    this.p5.stroke(this.c);
    this.p5.point(this.changePos.x, this.changePos.y);
  }

  limit() {
    this.changePos = this.pos.copy();
    this.p5.strokeWeight((this.p5.w += 3));
  }

  edge() {
    if (
      this.changePos.x > this.p5.width * 1.11 ||
      this.changePos.x < this.p5.width * -0.11 ||
      this.changePos.y > this.p5.height * 1.11 ||
      this.changePos.y < this.p5.height * -0.11
    ) {
      this.changePos.x = this.p5.random(this.p5.width / 6, this.p5.width);
      this.changePos.y = this.p5.random(this.p5.height / 6, this.p5.height);
    }
  }

  follow() {
    let history = [];
    history.push(this.pos.copy());
    for (let hist of history) {
      let prevPos = hist;
      this.p5.strokeWeight((this.p5.w += 0.05));

      this.p5.point(prevPos.x, prevPos.y);
    }

    if (history.length > 50) {
      let reStart = history[0];
      //this.a = 0;
      history.splice(0, 1);
      //this.pos = reStart;
      //console.log(reStart.x);
    }
  }

  //setForce(force) {this.dir.add(force);}
} //end of Particle class!
