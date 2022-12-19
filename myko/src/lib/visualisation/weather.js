import { add_render_callback } from 'svelte/internal';

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
    this.dropSize = dropSize;
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
    }
    this.p5.fill(c);
  }

  hover(umbrella) {
    let mouseDistance = this.p5.dist(this.p5.mouseX, this.p5.mouseY, this.pos.x, this.pos.y);
    if (this.weather === 'snow' && mouseDistance < 10) {
      this.varySize = 3;
      this.light = 80;
      this.sat = 95;
      this.hue = this.p5.floor(this.p5.random(360));
    }
    if (
      this.weather === 'rain' &&
      this.p5.mouseX >= this.cloudPos.x - this.size * 0.3 &&
      this.p5.mouseX <= this.cloudPos.x + this.size * 0.3
    ) {
      if (this.p5.mouseY >= this.cloudPos.y && this.p5.mouseY <= this.p5.height) {
        /*this.p5.push();
        this.p5.noFill();
        this.p5.stroke(30, 40, 45);
        this.p5.strokeWeight(7);
        this.p5.line(
          this.p5.mouseX,
          this.p5.mouseY,
          this.p5.mouseX,
          this.p5.mouseY + this.size * 0.18
        );
        this.p5.noStroke();
        this.p5.fill(170, 90, 10);
        this.p5.arc(
          this.p5.mouseX,
          this.p5.mouseY,
          this.size * 0.27,
          this.size * 0.2,
          this.p5.PI,
          0,
          this.p5.CHORD
        );
        this.p5.pop();*/
        //this.p5.cursor(umbrella);
        this.p5.image(
          umbrella,
          this.p5.mouseX,
          this.p5.mouseY,
          this.dropSize * 25,
          this.dropSize * 25
        );

        if (mouseDistance < this.size * 0.12) {
          this.newStartPos();
        }
      }
    }
  }

  heavyRain() {
    this.acc = 3;
    while (this.acc > 1.5) {
      this.acc -= 0.03;
    }
  }

  edge() {
    if (this.pos.y > this.p5.height) {
      this.newStartPos();
    }
  }

  newStartPos() {
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
