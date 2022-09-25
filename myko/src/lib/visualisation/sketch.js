import Particle from './particle';
import ActivityP from './activityParticle';
import p5Svelte from 'p5-svelte';
import { linear } from 'svelte/easing';

class Pictures {
  constructor(p5, type, size, location, number, xtraCnvs) {
    this.p5 = p5;
    this.xtraCnvs = xtraCnvs;
    this.type = type;
    this.size = size;
    this.pos = this.p5.createVector(location[0], location[1]);
    this.typeNr = number;
  }

  show(nr, weight) {
    this.xtraCnvs.imageMode(this.xtraCnvs.CENTER);
    if (this.typeNr > 11) {
      //this.xtraCnvs.push();
      //this.xtraCnvs.translate(this.pos.x, this.pos.y);
      //this.xtraCnvs.rotate(
      //this.xtraCnvs.random(-this.xtraCnvs.QUARTER_PI, this.xtraCnvs.QUARTER_PI)
      //);
      this.xtraCnvs.image(
        this.type[nr % this.type.length],
        this.pos.x,
        this.pos.y,
        this.size * 0.55,
        this.size * 0.55
      );
      console.log('hiya');
      //this.xtraCnvs.pop();
    } else {
      this.xtraCnvs.image(
        this.type[nr % this.type.length],
        this.pos.x,
        this.pos.y,
        this.size,
        this.size
      );
      if (this.type === teas) {
        this.xtraCnvs.strokeWeight(2);
        this.xtraCnvs.line(this.pos.x, this.pos.y - this.size / 2.1, this.pos.x, 0);
      }
    }

    //this.p5.drawingContext.shadowBlur = 15;
    //this.p5.drawingContext.shadowColor = 'lightgrey';
  }
}

class MovingPics extends Pictures {
  constructor(p5, type, size, location) {
    super(p5, type, size, location);
    this.vel = this.p5.createVector(0, 0);
    this.acc = this.p5.createVector(0, 0);
    this.maxSpeed = 4;
    this.angle = 0;
  }

  shows() {
    if (this.type === planes) {
      this.p5.push();
      this.p5.translate(this.pos.x, this.pos.y);
      this.p5.rotate(this.p5.HALF_PI);
      this.p5.rotate(this.angle);
      this.p5.image(planes[0], 0, 0, this.size, this.size);
      this.p5.pop();
    }
  }

  update() {
    let noiseScl = 50;
    let noiseStr = 1;
    let sclPos = this.p5.Vector.div(this.pos, noiseScl);
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

let canvas, xtraCnvs;
let addedThings = [],
  addedThingsMove = [],
  addedCats = [],
  addedDiys = [],
  addedTeas = [];
let cloud, streetlight, shelf, bucket;
let shelfPosX, shelfPosY, shelfSizeX, shelfSizeY;
let streetPosX, streetPosY;
let cloudPosX, cloudPosY, cloudSizeX, cloudSizeY;
let startPos, xInc, yLevel;
let horizontalView = true,
  portrait2x = false;
let catLocations, teaLocations, diyLocations, ideaLocations, xtraLocations;
let size, weight;
let teas = [];
let cats = [];
let diys = [];
let planes = []; /*'diy-hammernail.png',
  'diy-paperclip.png',
  'diy-btn1.png',
  'diy-wateringcan.png',
  'diy-scissors.png',
  'diy-colorpencils.png',
  'diy-btn2.png',
  'diy-magnifyingglass.png',
  'diy-sewingmachine.png',
  'diy-tapemeasure.png',
  'diy-btn3.png',*/

export function preload(p5) {
  cloud = p5.loadImage('cloud0.png');
  streetlight = p5.loadImage('streetlight.png');
  shelf = p5.loadImage('shelves.png');
  bucket = p5.loadImage('bucket.png');

  for (let i = 1; i < 5; i++) {
    teas.push(p5.loadImage(`tea${i}.png`));
  }
  for (let i = 1; i < 7; i++) {
    cats.push(p5.loadImage(`cat${i}.png`));
  }
  for (let i = 1; i < 12; i++) {
    diys.push(p5.loadImage(`diy${i}.png`));
  }
  planes.push(p5.loadImage('paperplane.png'));
  console.log(planes[0]);
}

export function windowResized(p5) {
  p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
}

export async function setup(p5) {
  canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight - 50);
  p5.pixelDensity(1);
  xtraCnvs = p5.createGraphics(p5.windowWidth, p5.windowHeight - 50);
  xtraCnvs.imageMode[xtraCnvs.CENTER];

  p5.frameRate(20);
  p5.imageMode(p5.CENTER);
  xtraCnvs.stroke(3, 77, 84);
  //p5.colorMode(p5.HSL, 360, 100, 100, 1.0);
  //p5.noiseSeed(0);p5.background(h, s, l, 1);

  ratio(p5);
  back(p5);

  xtraCnvs.strokeWeight(10);
  xtraCnvs.line(0, 0, p5.width, 0);
  xtraCnvs.line(0, p5.height, p5.width, p5.height);
  arrayLocations(p5);
  xtraCnvs.strokeWeight(3);

  const data = await fetchActivityLog(p5);
  checkForAdds(p5, data);
  showAdded(p5);
}

function ratio(p5) {
  if (p5.width < p5.height) {
    horizontalView = false;
  }
  if (2 * p5.width < p5.height) {
    portrait2x = true;
  }
}

function back(p5) {
  weight = 1.2;
  shelfPosX = xtraCnvs.width * -0.1;
  shelfPosY = xtraCnvs.height * 0.5;
  shelfSizeX = xtraCnvs.width * 0.67;
  shelfSizeY = xtraCnvs.height * 0.46;
  streetPosX = p5.windowWidth * 0.75;
  streetPosY = p5.windowHeight * 0.3;
  cloudPosY = p5.height * 0.24;
  //let bucketSize = p5.width * 0.3;

  if (horizontalView) {
    weight = 2.5;
    size = xtraCnvs.width * 0.073;
    streetPosX = xtraCnvs.width * 0.6;
    streetPosY = xtraCnvs.height * 0.25;
    cloudSizeX = xtraCnvs.width * 0.48;
    cloudSizeY = xtraCnvs.height * 0.9;
    cloudPosX = p5.width * 0.53;
    cloudPosY = p5.height * 0.15;
    shelfSizeX = p5.width * 0.5;
    shelfSizeY = p5.height * 0.75;
    shelfPosX = p5.width * -0.05;
    shelfPosY = p5.height * 0.3;
    //bucketSize = p5.width * 0.1;
  } else if (!portrait2x) {
    size = p5.width * 0.14;
    cloudSizeX = p5.width * 0.85;
    cloudSizeY = p5.width * 0.9;
    cloudPosX = p5.width * 0.4;
    cloudPosY = p5.height * 0.3;
  } else {
    size = p5.width * 0.18;
    cloudSizeX = p5.width * 0.95;
    cloudSizeY = p5.width * 1.22;
    cloudPosX = p5.width * 0.4;
  }

  //streetlight
  xtraCnvs.image(streetlight, streetPosX, streetPosY);
  //cloud
  xtraCnvs.image(cloud, cloudPosX, cloudPosY, cloudSizeX, cloudSizeY);
  //shelf
  xtraCnvs.image(shelf, shelfPosX, shelfPosY, shelfSizeX, shelfSizeY);
  //bucket
  //xtraCnvs.image(bucket, shelfPosX + shelfSizeX * 0.55, p5.height - 80, bucketSize, bucketSize);
}

function arrayLocations(p5) {
  //console.log('arrays places');
  let cloudTop = cloudPosY + cloudSizeY * 0.29;
  let cloud2Top = cloudPosY + cloudSizeY * 0.41;
  let cloud3Top = cloudPosY + cloudSizeY * 0.57;
  let cloudLeft = cloudPosX + cloudSizeX * 0.17;
  let cloudRight = cloudPosX + cloudSizeX * 0.6;
  let catLoc = [
    [p5.width * 0.75, cloudTop],
    [cloudLeft, cloud2Top],
    [cloudRight, cloud2Top],
    [cloudLeft, cloud3Top],
    [cloudRight, cloud3Top],
    [p5.width * 0.71, cloud3Top],
    [p5.width * 0.15, p5.height - size * 0.6],
    [p5.width * 0.35, p5.height - size * 0.6],
    [p5.width * 0.5, p5.height - size * 0.6],
    [p5.width * 0.66, p5.height - size * 0.6],
    [p5.width * 0.8, p5.height - size * 0.6],
    [p5.width * 0.92, p5.height - size * 0.6],
  ];

  startPos = xtraCnvs.width * 0.01;
  xInc = xtraCnvs.width * 0.045;
  yLevel = xtraCnvs.height;
  let teaLoc = [
    [startPos, p5.height * 0.16],
    [xInc, yLevel * 0.04],
    [xInc * 2, yLevel * 0.1],
    [xInc * 3, yLevel * 0.22],
    [xInc * 4, yLevel * 0.16],
    [xInc * 5, yLevel * 0.04],
    [xInc * 6, yLevel * 0.28],
    [xInc * 7, yLevel * 0.16],
    [xInc * 8, yLevel * 0.22],
    [xInc * 9, yLevel * 0.26],
    [xInc * 17, yLevel * 0.16],
    [xInc * 18, yLevel * 0.06],
  ];
  let topShelfY = shelfPosY + shelfSizeY * 0.2;
  let secondShelfY = shelfPosY + shelfSizeY * 0.44;
  let midShelfY = shelfPosY + shelfSizeY * 0.65;
  let fourthShelfY = shelfPosY + shelfSizeY * 0.7;
  let leftShelf = shelfPosX + shelfSizeX * 0.23;
  let midShelf = shelfPosX + shelfSizeX * 0.48;
  let rightShelf = shelfPosX + shelfSizeX * 0.75;
  let diyLoc = [
    [leftShelf, topShelfY],
    [midShelf, topShelfY],
    [rightShelf, topShelfY],
    [leftShelf, secondShelfY],
    [midShelf, secondShelfY],
    [rightShelf, secondShelfY],
    [leftShelf, midShelfY],
    [midShelf, midShelfY],
    [rightShelf, midShelfY],
    [leftShelf, fourthShelfY],
    [midShelf, fourthShelfY],
    [rightShelf, fourthShelfY],
  ];

  let overShelfY = shelfPosY - shelfSizeY * 0.035;
  let xtraLoc = [
    [shelfPosX + shelfSizeX * 0.28, overShelfY],
    [xtraCnvs.width * 0.25, yLevel * 0.17],
    [shelfPosX + shelfSizeX * 0.43, overShelfY],
    [xtraCnvs.width * 0.53, xtraCnvs.height * 0.54],
    [shelfPosX + shelfSizeX * 0.6, cloudPosY + cloudSizeY * 0.3],
    [xtraCnvs.width * 0.8, yLevel * 0.13],
    [xtraCnvs.width * 0.58, yLevel * 0.08],
    [leftShelf, overShelfY],
    [leftShelf, overShelfY],
    [xtraCnvs.width * 0.3, yLevel * 0.25],
  ];

  catLocations = [...catLoc];
  teaLocations = [...teaLoc];
  diyLocations = [...diyLoc];
  xtraLocations = [...xtraLoc];
}
/*
  //need to shuffle cat images and not location array probably, so that stuff further up will sit in the back, to look more true to life
  p5.shuffle(catLocations, true);
}*/

function showAdded(p5) {
  let index = 0;
  for (const ac of addedThings) {
    index++;
    ac.show(index, weight);
  }
}

export function draw(p5) {
  p5.background(2, 106, 116, 100);

  p5.image(xtraCnvs, p5.width * 0.5, p5.height * 0.5);
  for (const atm of addedThingsMove) {
    atm.update();
    atm.shows();
    atm.edge();
  }
}

async function fetchActivityLog(p5) {
  const response = await fetch('/api/aktiviteter/logg');
  if (!response.ok) {
    console.log('Could not get activity data');
    return null;
  }

  const logEntries = await response.json();
  //checkForNewEntries(p5, logEntries);

  // count the number of each activity
  return logEntries.reduce((result, entry) => {
    if (!(entry.activity in result)) {
      result[entry.activity] = 0;
    }
    result[entry.activity] += 1;
    return result;
  }, {});
}

function checkForAdds(p5, addedActivs) {
  console.log(addedActivs);

  if (!addedActivs) {
    console.log('no activities yet');
  } else {
    if ('tillverka-aktivitet' in addedActivs) {
      showThings(p5, addedActivs['tillverka-aktivitet'], diys, 1.2, diyLocations);
    }
    if ('halsa-pa-nasims-katter' in addedActivs) {
      showThings(p5, addedActivs['halsa-pa-nasims-katter'], cats, 1.32, catLocations);
    }
    if ('te-ritual' in addedActivs) {
      showThings(p5, addedActivs['te-ritual'], teas, 0.82, teaLocations);
    }
    if ('mykomote' in addedActivs) {
      showMoving(p5, addedActivs['mykomote']);
    }
    if ('prata-om-tema' in addedActivs) {
      showMoving(p5, addedActivs['prata-om-tema']);
    }
    if ('gor-ri-byrakrati' in addedActivs) {
      walking(p5, 1, p5.random(8, 9), 250, addedActivs['gor-ri-byrakrati']);
    }
  }
}

function showThings(p5, nr, type, varySize, locations) {
  for (let i = 0; i < nr; i++) {
    if (i >= locations.length) {
      //locations[i] = [xtraCnvs.random(xtraCnvs.width), xtraCnvs.random(xtraCnvs.height)];
      addedThings.push(
        new Pictures(p5, type, size * varySize, xtraLocations[i - locations.length], i, xtraCnvs)
      );
    } else {
      addedThings.push(new Pictures(p5, type, size * varySize, locations[i], i, xtraCnvs));
    }
  }
}

function showMoving(p5, nr) {
  for (let i = 0; i < nr; i++) {
    addedThingsMove.push(
      new MovingPics(p5, planes, size * 0.65, [
        p5.random(20, p5.width * 0.95),
        p5.random(20, p5.height * 0.5),
      ])
    );
  }
}
