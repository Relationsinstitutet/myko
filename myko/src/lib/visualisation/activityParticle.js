import Particle from './particle';

export default class ActivityP extends Particle {
  constructor(p5, x, y, h, w, ns, rot) {
    super(p5, x, y, h);
    this.w = w;
    this.noiseStr = ns;
    this.noiseScl = 300;
    this.speed = 0.6;
    this.l = this.p5.random(30, 45);
    this.rotate = rot;
  }
  show(sat) {
    this.p5.strokeWeight(this.w / 2);
    let col = this.p5.color(this.h, sat, this.l, 0.7);
    this.p5.stroke(col);
    this.p5.noFill();
    this.p5.arc(
      this.pos.x,
      this.pos.y,
      this.w * 1.2,
      this.w * 1.2,
      this.p5.TWO_PI - this.rotate,
      this.p5.QUARTER_PI + this.rotate,
      this.p5.OPEN
    );
    //this.p5.point(this.pos.x, this.pos.y);
  }
  update() {
    super.update();
  }
  speedo(sp, l) {
    this.speed = sp;
    this.l = l;
  }
  normalSize() {
    if (this.w > 9.5) {
      this.w -= 0.2;
    }
  }
}
