export class Drop {
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
    this.acc = 1.5;
    this.accDiff = accelerationDiff;
    this.vel = this.p5.createVector(0, 0);
    this.wind = 2;
    this.alpha = this.p5.map(this.startPos.z, 0, 40, 0.2, 1);
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
      c = this.p5.color(200, 0, 100, this.alpha);
      this.p5.circle(this.pos.x, this.pos.y, this.w * 1.75);
    }
    this.p5.fill(c);
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

export class GrassPatch {
  constructor(position, width, p5) {
    this.p5 = p5;
    this.xPos = [];
    this.rotationOff = [];
    //this.rotationVals = [];
    this.size = [];
    this.seg = [];
    this.index = 0;
    this.population = 85;

    for (let i = 0; i < this.population; i++) {
      this.index += 1;
      this.xPos.push(position + p5.randomGaussian(position, width));
      this.rotationOff.push(this.xPos[i] * 0.025 + 0.0175);
      //this.rotationVals.push(0);
      this.size.push(p5.randomGaussian(20, 4));
      this.seg.push(0.875);
    }
  }

  update() {
    for (let i = 0; i < this.index; i++) {
      let len = this.size[i];
      this.p5.push();
      this.p5.translate(this.xPos[i], this.p5.height);
      this.blade(len, i);
      this.p5.pop();
    }
  }

  blade(len, index) {
    this.rotationOff[index] += 0.005;
    this.p5.stroke(220 - len * 5 - index * 0.5, 90 - len * 2, 40 - len * 2.55);
    let rot = this.p5.map(
      this.p5.noise(this.rotationOff[index]),
      0,
      1,
      -this.p5.QUARTER_PI * 0.65,
      this.p5.QUARTER_PI
    );

    this.p5.strokeWeight(len * 0.28);
    this.p5.rotate(rot);
    this.p5.line(0, 0, 0, -len);
    this.p5.translate(0, -len);
    if (len > 9) {
      this.blade(len * this.seg[index], index);
    }
  }
}
