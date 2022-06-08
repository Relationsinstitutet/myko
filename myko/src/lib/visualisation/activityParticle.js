import Particle from './particle';

export default class ActivityP extends Particle {
  constructor(p5, x, y, h, w, ns) {
    super(p5, x, y, h);
    this.w = w;
    this.noiseStr = ns;
    this.noiseScl = 300;
    this.speed = 0.6;
    this.l = this.p5.random(30, 45);
  }
  show(sat) {
    this.p5.strokeWeight(this.w);
    let col = this.p5.color(this.h, sat, this.l, 0.9);
    this.p5.stroke(col);
    this.p5.point(this.pos.x, this.pos.y);
  }
  update() {
    super.update();
  }
  speedo(sp, l) {
    this.speed = sp;
    this.l = l;
  }
  normalSize() {
    if (this.w > 8) {
      this.w -= 0.2;
    }
  }
}
