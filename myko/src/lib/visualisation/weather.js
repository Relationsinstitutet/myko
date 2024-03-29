//import { add_render_callback } from 'svelte/internal';

//import { InMemoryCache } from '@auth0/auth0-spa-js';

let drops = [];
let grass = [];
let accelerationDiff;
let precipitationSize, weatherPos, dropSize, weatherSize;
let weatherCloud;

//----------------------------------------
//--------------PRECIPITATION-------------
export class Drop {
  constructor(weatherType, weatherPos, cloudSize, dropSize, accDiff, p5) {
    this.p5 = p5;
    this.weather = weatherType;
    this.size = cloudSize;
    this.weatherPos = weatherPos;
    this.startPos = this.p5.createVector(
      this.p5.random(weatherPos[0] - this.size * 0.35, weatherPos[0] + this.size * 0.35),
      this.p5.random(weatherPos[1], weatherPos[1] + this.p5.height * 0.25),
      this.p5.random(0, 30)
    );
    this.pos = this.startPos.copy();
    this.cloudPos = this.p5.createVector(weatherPos[0], weatherPos[1]);
    this.w = this.p5.map(this.startPos.z, 0, 30, 0.45 * dropSize, 1.4 * dropSize);
    this.h = this.p5.map(this.startPos.z, 0, 30, 14 * dropSize, 7 * dropSize);
    this.acc = 0.7;
    this.accDiff = accDiff;
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
      this.p5.rect(this.pos.x, this.pos.y, this.w, this.h, this.w * 1.25);
      this.acc = 8;
    }
    if (this.weather === 'snow') {
      c = this.p5.color(this.hue, this.sat, this.light, this.alpha);
      this.p5.circle(this.pos.x, this.pos.y, this.w * 2.05);
    }
    this.p5.fill(c);
  }

  hover(umbrella) {
    let mouseDistance = this.p5.dist(this.p5.mouseX, this.p5.mouseY, this.pos.x, this.pos.y);
    if (this.weather === 'snow' && mouseDistance < 10) {
      if (this.w < dropSize * 0.55) {
        this.w *= 1.05;
      }
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
        this.p5.image(umbrella, this.p5.mouseX, this.p5.mouseY, dropSize * 0.9, dropSize * 0.9);

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
//----------------------------------------
//----------------WINDY GRASS-------------
export class GrassBlade {
  constructor(position, width, index, p5) {
    this.p5 = p5;
    this.index = index;
    this.xPos = position + p5.randomGaussian(position, width);
    this.rotationOff = this.xPos * 0.025 + 0.0175;
    this.size = p5.randomGaussian(20, 4);
    this.seg = 0.875;
  }

  update() {
    let len = this.size;
    this.p5.push();
    this.p5.translate(this.xPos, this.p5.height);
    this.blade(len);
    this.p5.pop();
  }

  blade(len) {
    this.rotationOff += 0.005;
    this.p5.stroke(220 - len * 5 - this.index * 0.5, 90 - len * 2, 42 - len * 2.2);
    let rot = this.p5.map(
      this.p5.noise(this.rotationOff),
      0,
      1,
      -this.p5.QUARTER_PI * 0.5,
      this.p5.QUARTER_PI * 0.5
    );

    this.p5.strokeWeight(len * 0.25);
    this.p5.rotate(rot);
    this.p5.line(0, 0, 0, -len);
    this.p5.translate(0, -len);
    if (len > 9) {
      this.blade(len * this.seg);
    }
  }
}
//-------------END OF CLASSES-------------
//----------------------------------------
export function prepareDrops(snow, rain, imgPos, p5, cloud, dropS, staticLayer) {
  dropSize = dropS;
  weatherSize = imgPos[2];
  // Snows in absence of cats
  if (snow) {
    weatherPos = imgPos[1];
    accelerationDiff = 3;
    weatherCloud = cloud[1];
    makeWeather('snow', p5, staticLayer);
  }
  // Rains in absence of tools
  if (rain) {
    weatherPos = imgPos[0];
    accelerationDiff = 8.5;
    weatherCloud = cloud[0];
    makeWeather('rain', p5, staticLayer);
  }
  return drops;
}

function makeWeather(weatherType, p5, staticLayer) {
  precipitationSize = dropSize * 0.0375;
  staticLayer.imageMode(staticLayer.CENTER);
  staticLayer.image(weatherCloud, weatherPos[0], weatherPos[1], weatherSize[0], weatherSize[1]);
  for (let i = 0; i < 220; i++) {
    drops.push(
      new Drop(weatherType, weatherPos, weatherSize[0], precipitationSize, accelerationDiff, p5)
    );
  }
  return drops;
}

export function makeWind(p5) {
  //console.log('windier');
  for (let i = 0; i < 85; i++) {
    grass.push(new GrassBlade(p5.width * 0.11, p5.width * 0.11, i, p5));
  }
  return grass;
}
