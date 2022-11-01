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
import { makeWeather } from './weather';

let canvas, xtraCnvs, xtraCnvs2;
let currentDate, currentWeek;
let addedThings = [],
  addedThingsMove = [],
  newAdds = [];
let cloud, streetlight, shelf;
let imagePositions, proportions; //, ideaLocations
let teas = [];
let cats = [];
let diys = [];
let planes = [];
let cranes = [];
let thoughts = [];
let weatherOn = false;
let weatherType = '';
let weatherPosition;
let precipitationCloud;

export function preload(p5) {
  cloud = p5.loadImage('cloud0.png');
  streetlight = p5.loadImage('streetlight.png');
  shelf = p5.loadImage('shelves.png');

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

  xtraCnvs = p5.createGraphics(p5.windowWidth, p5.windowHeight - 50);
  xtraCnvs.imageMode[xtraCnvs.CENTER];
  xtraCnvs.stroke(3, 58, 65);

  xtraCnvs2 = p5.createGraphics(p5.windowWidth, p5.windowHeight - 50);
  xtraCnvs2.frameRate(20);
  xtraCnvs2.imageMode[xtraCnvs2.CENTER];
  xtraCnvs2.colorMode(xtraCnvs.HSL, 360, 100, 100, 1.0);

  currentDate = new Date();
  currentWeek = getWeekDate(currentDate);
  xtraCnvs.randomSeed(currentWeek);

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
  //returns image location arrays; -cats, -tea, -diy, -xtra
  imagePositions = fixImagePositions(p5, proportions[0]);

  const data = await fetchActivityLog(p5);
  checkForAdds(p5, data[1], 0);
  checkForAdds(p5, data[0], 'new');
  showAdded();
  return canvas;
}

function showAdded() {
  for (const ac of addedThings) {
    ac.show(proportions[1]);
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
  if (weatherOn && weatherType) {
    p5.image(precipitationCloud, weatherPosition[0], weatherPosition[1]);
    makeWeather(weatherType, weatherPosition, p5);
  }

  for (const [index, na] of newAdds.entries()) {
    na.show(proportions[1]);
    na.grow(index);
  }
}

async function fetchActivityLog(p5) {
  const response = await fetch('/api/aktiviteter/logg');
  if (!response.ok) {
    console.log('Could not get activity data');
    return null;
  }
  const logEntries = await response.json();
  let entries = checkForNewEntries(logEntries);

  // count the number of each activity
  let newerEntries = entries[0].reduce((result, entry) => {
    if (!(entry.activity in result)) {
      result[entry.activity] = 0;
    }
    result[entry.activity] += 1;
    return result;
  }, {});

  let newEntries = entries[1].reduce((result, entry) => {
    if (!(entry.activity in result)) {
      result[entry.activity] = 0;
    }
    result[entry.activity] += 1;
    return result;
  }, {});
  return [newerEntries, newEntries];
}

function checkForNewEntries(logEntries) {
  const currentDay = currentDate.getDay();
  const currentHour = currentDate.getHours();

  for (let entry of logEntries) {
    const entryDate = new Date(entry.date);
    const acceptedEntry = isNewDate(entryDate, currentWeek, currentDay, currentHour);

    if (acceptedEntry[0]) {
      entry.thisHour = true;
    } else if (acceptedEntry[1]) {
      entry.thisWeek = true;
    }
  }
  let newerEntries = logEntries.filter((el) => {
    return el.thisHour;
  });
  let newEntries = logEntries.filter((el) => {
    return el.thisWeek;
  });
  return [newerEntries, newEntries];
}

function getWeekDate(date) {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil(days / 7);

  return weekNumber;
}

function isNewDate(entryDate, currentWeek, currentDay, currentHour) {
  const week = getWeekDate(entryDate);
  //should change this to getDate actually, so don't risk getting the wrong day if time restriction gets longer than seven days!!!!!!!!!!!!!!!!!!!!!!!!!!
  const day = entryDate.getDay();
  const hour = entryDate.getHours();

  let pastHour = false;
  let earlierThisWeek = false;

  if (week >= currentWeek) {
    //checks for present day and closest 2 hours
    if (day === currentDay && currentHour - hour < 2) {
      pastHour = true;
    } else {
      earlierThisWeek = true;
    }
  }
  return [pastHour, earlierThisWeek];
}

function checkForAdds(p5, addedActivs, newness) {
  console.log(addedActivs);

  if (!addedActivs) {
    console.log('no activities yet');
  } else {
    if (!('tillverka-aktivitet' in addedActivs)) {
      weatherOn = true;
      weatherPosition = imagePositions[2][2]; // Rains in absence of tools
      weatherType = 'rain';
    }
    if (!('halsa-pa-nasims-katter' in addedActivs)) {
      weatherOn = true;
      weatherPosition = imagePositions[0][1]; // Snows in absence of cats
      weatherType = 'snow';
    }
    if ('tillverka-aktivitet' in addedActivs) {
      showThings(addedActivs['tillverka-aktivitet'], diys, 'diys', 1.2, imagePositions[2], newness);
    }
    if ('halsa-pa-nasims-katter' in addedActivs) {
      showThings(
        addedActivs['halsa-pa-nasims-katter'],
        cats,
        'cats',
        1.32,
        imagePositions[0],
        newness
      );
    }
    if ('te-ritual' in addedActivs) {
      showThings(addedActivs['te-ritual'], teas, 'teas', 0.82, imagePositions[1], newness);
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

function showThings(nr, type, typeName, varySize, locations, newness) {
  for (let i = 0; i < nr; i++) {
    if (i >= locations.length) {
      addedThings.push(
        new Pictures(type, proportions[0] * varySize, typeName, xtraCnvs, imagePositions[3], i)
      );
    } else {
      if (!newness) {
        addedThings.push(
          new Pictures(type, proportions[0] * varySize, typeName, xtraCnvs, locations, i)
        );
      } else {
        newAdds.push(
          new Pictures(type, proportions[0] * varySize, typeName, xtraCnvs, locations, i, 15)
        );
      }
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
