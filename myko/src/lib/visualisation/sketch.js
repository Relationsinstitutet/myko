import Pictures from './class';
import MovingPics from './classMoving';
//import p5Svelte from 'p5-svelte';
//import { linear } from 'svelte/easing';

let canvas,
  xtraCnvs,
  xtraCnvs2,
  mult = 0.005,
  randomH1,
  randomH2,
  flowWeight;
let points = [];
let addedThings = [],
  addedThingsMove = [];
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
let planes = [];
let cranes = [];
let thoughts = [];

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
  p5.imageMode(p5.CENTER);
  p5.rectMode(p5.CENTER);
  p5.pixelDensity(1);
  xtraCnvs = p5.createGraphics(p5.windowWidth, p5.windowHeight - 50);
  xtraCnvs.imageMode[xtraCnvs.CENTER];
  xtraCnvs2 = p5.createGraphics(p5.windowWidth, p5.windowHeight - 50);
  xtraCnvs2.imageMode[xtraCnvs2.CENTER];

  p5.frameRate(20);
  xtraCnvs2.frameRate(20);
  flowWeight = 0.1;

  xtraCnvs2.colorMode(xtraCnvs.HSL, 360, 100, 100, 1.0);
  xtraCnvs.stroke(3, 77, 84);

  flowfieldSetup(xtraCnvs2);
  ratio(p5);
  back(p5);

  xtraCnvs.strokeWeight(10);
  xtraCnvs.line(0, 0, p5.width, 0);
  xtraCnvs.line(0, p5.height, p5.width, p5.height);
  arrayLocations(p5);

  const data = await fetchActivityLog(p5);
  checkForAdds(p5, data);
  showAdded(p5);
  return canvas;
}

function flowfieldSetup(xtraCnvs2) {
  xtraCnvs2.angleMode(xtraCnvs2.DEGREES);
  xtraCnvs2.noiseDetail(1);
  let density = 20;
  let space = xtraCnvs2.width / density;
  for (let x = 0; x < xtraCnvs2.width; x += space) {
    for (let y = 0; y < xtraCnvs2.height; y += space) {
      let pointPlace = xtraCnvs2.createVector(
        x + xtraCnvs2.random(-10, 10),
        y + xtraCnvs2.random(-10, 10)
      );
      points.push(pointPlace);
    }
  }

  randomH1 = xtraCnvs.random(0, 360);
  randomH2 = (randomH1 + xtraCnvs.random(45, 110)) % 360;
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
  cloudPosY = p5.height * 0.32;
  //let bucketSize = p5.width * 0.3;

  if (horizontalView) {
    flowWeight = 1;
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
  } else {
    size = p5.width * 0.18;
    cloudSizeX = p5.width * 1;
    cloudSizeY = p5.width * 1.2;
    cloudPosX = p5.width * 0.38;
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
  let cloudTop = cloudPosY + cloudSizeY * 0.29;
  let cloud2Top = cloudPosY + cloudSizeY * 0.41;
  let cloud3Top = cloudPosY + cloudSizeY * 0.57;
  let cloudLeft = cloudPosX + cloudSizeX * 0.17;
  let cloudRight = cloudPosX + cloudSizeX * 0.62;
  let catLoc = [
    [p5.width * 0.75, cloudTop],
    [cloudLeft, cloud2Top],
    [cloudRight, cloud2Top],
    [cloudLeft, cloud3Top],
    [cloudRight, cloud3Top],
    [p5.width * 0.725, cloud3Top],
    [p5.width * 0.13, p5.height - size * 0.46],
    [p5.width * 0.34, p5.height - size * 0.46],
    [p5.width * 0.51, p5.height - size * 0.46],
    [p5.width * 0.66, p5.height - size * 0.46],
    [p5.width * 0.8, p5.height - size * 0.46],
    [p5.width * 0.92, p5.height - size * 0.46],
  ];

  startPos = xtraCnvs.width * 0.015;
  xInc = xtraCnvs.width * 0.045;
  yLevel = xtraCnvs.height;
  let teaLoc = [
    [startPos, p5.height * 0.18],
    [xInc, yLevel * 0.06],
    [xInc * 2, yLevel * 0.12],
    [xInc * 3, yLevel * 0.22],
    [xInc * 4, yLevel * 0.1],
    [xInc * 5, yLevel * 0.04],
    [xInc * 6, yLevel * 0.28],
    [xInc * 7, yLevel * 0.2],
    [xInc * 8, yLevel * 0.06],
    [xInc * 9, yLevel * 0.26],
    [xInc * 17, yLevel * 0.16],
    [xInc * 18, yLevel * 0.1],
  ];
  let topShelfY = shelfPosY + shelfSizeY * 0.2;
  let secondShelfY = shelfPosY + shelfSizeY * 0.44;
  let midShelfY = shelfPosY + shelfSizeY * 0.65;
  let fourthShelfY = shelfPosY + shelfSizeY * 0.85;
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

  let overShelfY = shelfPosY - shelfSizeY * 0.019;
  let xtraLoc = [
    [shelfPosX + shelfSizeX * 0.28, overShelfY],
    [xtraCnvs.width * 0.25, yLevel * 0.17],
    [shelfPosX + shelfSizeX * 0.52, overShelfY],
    [xtraCnvs.width * 0.57, xtraCnvs.height * 0.62],
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
  for (const [index, ac] of addedThings.entries()) {
    ac.show(index, weight);
  }
}

export function draw(p5) {
  p5.background(2, 106, 116, 100);
  p5.erase();
  p5.rect(p5.width * 0.5, 115, 180, 60);
  p5.noErase();

  flowfieldDraw(xtraCnvs2);

  p5.image(xtraCnvs2, p5.width * 0.5, p5.height * 0.5);
  p5.image(xtraCnvs, p5.width * 0.5, p5.height * 0.5);
  for (const [index, atm] of addedThingsMove.entries()) {
    atm.update();
    atm.shows(index);
    atm.edge();
  }
}

function flowfieldDraw(xtraCnvs2) {
  xtraCnvs2.strokeWeight(flowWeight);
  for (let i = 0; i < points.length; i++) {
    let h = xtraCnvs2.map(points[i].x, 0, xtraCnvs2.width, randomH1, randomH2);
    let l = xtraCnvs2.map(points[i].y, 0, xtraCnvs2.height, 10, 90);
    let a = xtraCnvs2.map(
      xtraCnvs2.dist(xtraCnvs2.width / 2, xtraCnvs2.height / 2, points[i].x, points[i].y),
      0,
      450,
      1,
      0
    );

    xtraCnvs2.stroke(h, 95, l, a);

    let angle = xtraCnvs2.map(
      xtraCnvs2.noise(points[i].x * mult, points[i].y * mult),
      0,
      1,
      0,
      720
    );
    points[i].add(xtraCnvs2.createVector(xtraCnvs2.cos(angle), xtraCnvs2.sin(angle)));

    if (xtraCnvs2.dist(xtraCnvs2.width / 2, xtraCnvs2.height / 2, points[i].x, points[i].y) < 450) {
      xtraCnvs2.point(points[i].x, points[i].y);
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
      showThings(p5, addedActivs['tillverka-aktivitet'], diys, 'diys', 1.2, diyLocations);
    }
    if ('halsa-pa-nasims-katter' in addedActivs) {
      showThings(p5, addedActivs['halsa-pa-nasims-katter'], cats, 'cats', 1.32, catLocations);
    }
    if ('te-ritual' in addedActivs) {
      showThings(p5, addedActivs['te-ritual'], teas, 'teas', 0.82, teaLocations);
    }
    if ('mykomote' in addedActivs) {
      showMoving(p5, addedActivs['mykomote'], planes, 'planes', 0.6, 0.1, 0.95, 1.55, 65);
    }
    if ('prata-om-tema' in addedActivs) {
      showMoving(p5, addedActivs['prata-om-tema'], thoughts, 'thoughts', 0.5, 0.25, 0.75, 0, 1);
    }
    if ('gor-ri-byrakrati' in addedActivs) {
      showMoving(p5, addedActivs['gor-ri-byrakrati'], cranes, 'cranes', 0.85, 0.4, 0.6, 3.4, 150);
      //walking(p5, 1, p5.random(8, 9), 250, addedActivs['gor-ri-byrakrati']);
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
          size * varySize,
          typeName,
          xtraCnvs,
          p5,
          xtraLocations[i % locations.length],
          i
        )
      );
    } else {
      addedThings.push(
        new Pictures(type, size * varySize, typeName, xtraCnvs, p5, locations[i], i)
      );
    }
  }
}

function showMoving(p5, nr, type, typeName, varySize, location1, location2, rotation, noiseScl) {
  for (let i = 0; i < nr; i++) {
    addedThingsMove.push(
      new MovingPics(
        type,
        size * varySize,
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
