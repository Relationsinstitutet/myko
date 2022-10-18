import Pictures from './class';
import MovingPics from './classMoving';
import {
  ratio,
  proportionsByRatio,
  fixBgImagePositions,
  drawBackgroundImages,
  fixImagePositions,
} from './locations';
import { flowfieldDraw, flowfieldSetup } from './flowfield';
//import p5Svelte from 'p5-svelte';
//import { linear } from 'svelte/easing';

class Drop {
  constructor(p5) {
    this.p5 = p5;

    this.x = this.p5.random(this.p5.width * 0.5, this.p5.width + 50);
    this.y = this.p5.random(500, 250);
    this.z = this.p5.random(0, 30);
    this.w = this.p5.random(3);
    this.h = this.p5.map(this.z, 0, 20, 10, 20);
    this.vel = this.p5.map(this.z, 0, 3, 2, 3);
    this.wind = 3;
  }

  update(windForce) {
    this.wind = windForce;
    this.y += this.vel;
    this.x -= this.wind;
  }

  draw() {
    this.p5.noStroke();
    this.p5.rotate(this.p5.PI / this.wind);
    let c = this.p5.color(180, 11, 86, 50);
    //c = color(255); snow
    this.p5.fill(c);
    //circle(this.x, this.y, this.w, this.h); snow
    this.p5.rect(this.x, this.y, this.w, this.h);
  }
}

let canvas, xtraCnvs, xtraCnvs2;
let addedThings = [],
  addedThingsMove = [];
let cloud, streetlight, shelf;
let imagePositions, proportions; //, ideaLocations
let teas = [];
let cats = [];
let diys = [];
let planes = [];
let cranes = [];
let thoughts = [];
let rain = [];
let heavy;
let currentTime;
let lastTime;
let timer = 0;

export function preload(p5) {
  cloud = p5.loadImage('cloud0.png');
  streetlight = p5.loadImage('streetlight.png');
  shelf = p5.loadImage('shelves.png');
  //bucket = p5.loadImage('bucket.png');

  for (let i = 1; i < 8; i++) {
    teas.push(p5.loadImage(`tea${i}.png`));
  }
  for (let i = 1; i < 12; i++) {
    diys.push(p5.loadImage(`diy${i}.png`));
    cats.push(p5.loadImage(`cat${i}.png`));
  }
  planes.push(p5.loadImage('paperplane.png'));
  for (let i = 1; i < 5; i++) {
    cranes.push(p5.loadImage(`crane${i}.png`));
  }
}

export function windowResized(p5) {
  p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
}

export async function setup(p5) {
  canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight - 50);
  p5.frameRate(20);
  p5.imageMode(p5.CENTER);
  p5.rectMode(p5.CENTER);
  p5.pixelDensity(1);

  generateDrops(5, 30, p5);
  lastTime = p5.millis();

  xtraCnvs = p5.createGraphics(p5.windowWidth, p5.windowHeight - 50);
  xtraCnvs.imageMode[xtraCnvs.CENTER];
  xtraCnvs.stroke(3, 58, 65);

  xtraCnvs2 = p5.createGraphics(p5.windowWidth, p5.windowHeight - 50);
  xtraCnvs2.frameRate(20);
  xtraCnvs2.imageMode[xtraCnvs2.CENTER];
  xtraCnvs2.colorMode(xtraCnvs.HSL, 360, 100, 100, 1.0);

  flowfieldSetup(xtraCnvs2);
  ratio(p5);
  //returns -foreground image size, -(stroke)weight, -flowfield strokeweight
  proportions = proportionsByRatio(xtraCnvs);
  fixBgImagePositions(xtraCnvs);
  drawBackgroundImages(xtraCnvs, cloud, streetlight, shelf);

  //lines marking vertical start & end of the canvas
  xtraCnvs.strokeWeight(10);
  xtraCnvs.line(0, 0, p5.width, 0);
  xtraCnvs.line(0, p5.height, p5.width, p5.height);
  //returns arrays w image locations; -cats, -tea, -diy, -xtra
  imagePositions = fixImagePositions(p5, proportions[0]);

  const data = await fetchActivityLog(p5);
  checkForAdds(p5, data);
  showAdded();
  return canvas;
}

function showAdded() {
  for (const [index, ac] of addedThings.entries()) {
    ac.show(index, proportions[1]);
  }
}

export function draw(p5) {
  p5.background(2, 106, 116, 100);
  p5.erase();
  p5.rect(p5.width * 0.5, 125, 227, 36);
  p5.noErase();

  flowfieldDraw(xtraCnvs2, proportions[2]);

  p5.image(xtraCnvs2, p5.width * 0.5, p5.height * 0.5);
  p5.image(xtraCnvs, p5.width * 0.5, p5.height * 0.5);
  for (const [index, atm] of addedThingsMove.entries()) {
    atm.update();
    atm.shows(index);
    atm.edge();
  }

  currentTime = p5.millis();
  timer += currentTime - lastTime;
  lastTime = currentTime;

  if (timer > 300) {
    heavy = p5.random(0, 40);
    generateDrops(heavy / 2, heavy * 2, p5);

    timer = 0;
  }

  for (let i = 0; i < rain.length; i++) {
    if (rain[i].y > p5.height) {
      rain.splice(i, 1);
    } else {
      rain[i].update(1);
      rain[i].draw();
    }
  }
}

async function fetchActivityLog(p5) {
  const response = await fetch('/api/aktiviteter/logg');
  if (!response.ok) {
    console.log('Could not get activity data');
    return null;
  }

  const logEntries = await response.json();
  checkForNewEntries(logEntries);

  // count the number of each activity
  return logEntries.reduce((result, entry) => {
    if (!(entry.activity in result)) {
      result[entry.activity] = 0;
    }
    result[entry.activity] += 1;
    return result;
  }, {});
}

function checkForNewEntries(logEntries) {
  const todayDate = new Date();
  let nrNewAdds = 0;
  for (let entry of logEntries) {
    let entryDate = new Date(entry.date);
    if (isNewDate(entryDate, todayDate)) {
      nrNewAdds++;
      console.log(`${entryDate}`);
    }
  }
  if (nrNewAdds) {
    console.log(nrNewAdds);
  }
}

function isNewDate(entryDate, todayDate) {
  if (
    entryDate.getDate() === todayDate.getDate() &&
    entryDate.getMonth() === todayDate.getMonth()
  ) {
    return true;
  }
}

function checkForAdds(p5, addedActivs) {
  console.log(addedActivs);

  if (!addedActivs) {
    console.log('no activities yet');
  } else {
    if ('tillverka-aktivitet' in addedActivs) {
      showThings(p5, addedActivs['tillverka-aktivitet'], diys, 'diys', 1.2, imagePositions[2]);
    }
    if ('halsa-pa-nasims-katter' in addedActivs) {
      showThings(p5, addedActivs['halsa-pa-nasims-katter'], cats, 'cats', 1.32, imagePositions[0]);
    }
    if ('te-ritual' in addedActivs) {
      showThings(p5, addedActivs['te-ritual'], teas, 'teas', 0.82, imagePositions[1]);
    }
    if ('mykomote' in addedActivs) {
      showMoving(p5, addedActivs['mykomote'], planes, 'planes', 0.6, 0.1, 0.95, 1.55, 65);
    }
    if ('prata-om-tema' in addedActivs) {
      showMoving(p5, addedActivs['prata-om-tema'], thoughts, 'thoughts', 0.5, 0.25, 0.75, 0, 1);
    }
    if ('gor-ri-byrakrati' in addedActivs) {
      showMoving(p5, addedActivs['gor-ri-byrakrati'], cranes, 'cranes', 0.85, 0.4, 0.6, 3.4, 150);
    }
  }
}

function showThings(p5, nr, type, typeName, varySize, locations) {
  for (let i = 0; i < nr; i++) {
    if (i >= locations.length) {
      //locations[i] = [xtraCnvs.random(xtraCnvs.width), xtraCnvs.random(xtraCnvs.height)];
      addedThings.push(
        new Pictures(
          type,
          proportions[0] * varySize,
          typeName,
          xtraCnvs,
          p5,
          imagePositions[3][i % locations.length],
          i
        )
      );
    } else {
      addedThings.push(
        new Pictures(type, proportions[0] * varySize, typeName, xtraCnvs, p5, locations[i], i)
      );
    }
  }
}

function showMoving(p5, nr, type, typeName, varySize, location1, location2, rotation, noiseScl) {
  for (let i = 0; i < nr; i++) {
    addedThingsMove.push(
      new MovingPics(
        type,
        proportions[0] * varySize,
        typeName,
        p5,
        [
          p5.random(p5.width * location1, p5.width * location2),
          p5.random(p5.height * location1, p5.height * location2),
        ],
        rotation,
        noiseScl
      )
    );
  }
}

function generateDrops(min, max, p5) {
  for (let i = min; i < max; i++) {
    let drop = new Drop(p5);
    rain.push(drop);
  }
}
