import Particle from './particle';

export default class ActivityP extends Particle {
  constructor(p5, x, y, hue, strokeweight, noise, rotate) {
    super(p5, x, y, hue);
    this.strokeweight = strokeweight;
    this.noiseStr = noise;
    this.noiseScl = 300;
    this.speed = 0.6;
    this.light = this.p5.random(30, 45);
    this.rotate = rotate;
  }
  show(sat) {
    this.p5.strokeWeight(this.strokeweight / 2);
    let col = this.p5.color(this.hue, sat, this.light, 0.7);
    this.p5.stroke(col);
    this.p5.noFill();
    this.p5.arc(
      this.pos.x,
      this.pos.y,
      this.strokeweight * 1.2,
      this.strokeweight * 1.2,
      this.p5.TWO_PI - this.rotate,
      this.p5.QUARTER_PI + this.rotate,
      this.p5.OPEN
    );
    //this.p5.point(this.pos.x, this.pos.y);
  }
  update() {
    super.update();
  }
  speedo(speed, light) {
    this.speed = speed;
    this.light = light;
  }
  normalSize() {
    if (this.strokeweight > 9.5) {
      this.strokeweight -= 0.2;
    }
  }
}
