import Pictures from './pictures';
import { MovingPics, Particles } from './moving';
import Drop from './weather';
import {
  ratio,
  proportionsByRatio,
  fixBgImagePositions,
  drawBackgroundImages,
  fixImagePositions,
} from './locations';
import { flowfieldDraw, flowfieldSetup } from './flowfield';

let canvas, xtraCnvs, xtraCnvs2;
let currentDate, currentWeek;
let addedThings = [],
  addedThingsMove = [],
  particles = [],
  newAdds = [];
let cloud, streetlight, shelf;
let imagePositions, proportions;
let teas = [];
let cats = [];
let diys = [];
let planes = [];
let particleSystem, particleSize, p;
let snow = false;
let rain = false;
//let weatherType = '';
let weatherPosition, weatherSize, precipitationSize, accelerationDiff;
let weatherSpeed = 1;
let drops = [];
let snowCloud, rainCloud;

/* -------FUNCTIONS BEGIN------- */
export function preload(p5) {
  cloud = p5.loadImage('cloud0.png');
  streetlight = p5.loadImage('streetlight.png');
  shelf = p5.loadImage('shelves.png');
  rainCloud = p5.loadImage('cloud1.png');
  snowCloud = p5.loadImage('cloud2.png');

  for (let i = 1; i < 8; i++) {
    teas.push(p5.loadImage(`tea${i}.png`));
  }
  for (let i = 1; i < 12; i++) {
    diys.push(p5.loadImage(`diy${i}.png`));
    cats.push(p5.loadImage(`cat${i}.png`));
  }
  planes.push(p5.loadImage('paperplane.png'));
}

export function windowResized(p5) {
  p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
}

export async function setup(p5) {
  canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight - 50);
  p5.frameRate(20);
  p5.imageMode(p5.CENTER);
  p5.rectMode(p5.CENTER);
  p5.colorMode(p5.HSL, 360, 100, 100, 1.0);
  p5.stroke(185, 94, 8, 1);
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
  p5.randomSeed(currentWeek);

  flowfieldSetup(xtraCnvs2);
  ratio(p5);

  // Return foreground image size, strokeweight, flowfield strokeweight
  proportions = proportionsByRatio(xtraCnvs);
  fixBgImagePositions(xtraCnvs);
  drawBackgroundImages(xtraCnvs, cloud, streetlight, shelf);

  // Mark vertical start & end of canvas
  xtraCnvs.strokeWeight(10);
  xtraCnvs.line(0, 0, p5.width, 0);
  xtraCnvs.line(0, p5.height, p5.width, p5.height);

  // Return image location arrays; cats, tea, diy, xtra, particles, weathercloud size
  imagePositions = fixImagePositions(p5, proportions[0]);

  const data = await fetchActivityLog(p5);
  checkForAdds(p5, data[0], 'new');
  checkForAdds(p5, data[1], 0);
  showAdded();

  if (snow || rain) {
    prepareWeather(p5);
  }
  return canvas;
}

function prepareWeather(p5, weatherType) {
  // Snows in absence of cats
  if (snow) {
    weatherPosition = imagePositions[5][1];
    weatherType = 'snow';
    accelerationDiff = 2.5;
    makeWeather(weatherType, weatherPosition, snowCloud, accelerationDiff, p5);
  }
  // Rains in absence of tools
  if (rain) {
    weatherPosition = imagePositions[5][0];
    weatherType = 'rain';
    accelerationDiff = 5;
    makeWeather(weatherType, weatherPosition, rainCloud, accelerationDiff, p5);
  }
}

function makeWeather(weatherType, weatherPos, cloud, accDiff, p5) {
  weatherSize = imagePositions[5][2];
  precipitationSize = proportions[0] * 0.0375;
  xtraCnvs.image(cloud, weatherPosition[0], weatherPosition[1], weatherSize[0], weatherSize[1]);
  for (let i = 0; i < 220; i++) {
    drops.push(new Drop(weatherType, weatherPos, weatherSize[0], precipitationSize, accDiff, p5));
  }
}

function showAdded() {
  for (const ac of addedThings) {
    ac.show(proportions[1]);
  }
}

export function draw(p5) {
  // Cutout to show samtid menu behind canvas
  p5.background(185, 97, 23, 0.85);
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
  if (particleSystem) {
    if (p5.frameCount % p5.floor(20 / particleSystem) == 0) {
      p = new Particles(imagePositions[4][0], imagePositions[4][1], particleSize, p5);
      particles.push(p);
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].show(particleSystem, 40 + 10 * particleSystem);
      particles[i].update();
      if (particles[i].finished()) {
        particles.splice(i, 1);
      }
    }
  }
  if (drops.length) {
    for (const drop of drops) {
      drop.show();
      drop.update(weatherSpeed);
      drop.edge();
    }
  }
  for (const [index, na] of newAdds.entries()) {
    na.show(proportions[1]);
    na.grow(index);
  }
}

async function fetchActivityLog() {
  const response = await fetch('/api/aktiviteter/logg');
  if (!response.ok) {
    console.log('Could not get activity data');
    return null;
  }
  const logEntries = await response.json();
  let entries = checkForNewEntries(logEntries);

  // Counts the number of each activity
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
  const currentDay = currentDate.getDate();
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

function isNewDate(entryDate, currentDay, currentHour) {
  const week = getWeekDate(entryDate);
  const day = entryDate.getDate();

  const hour = entryDate.getHours();
  let pastHour = false;
  let earlierThisWeek = false;

  if (week >= currentWeek) {
    // Checks for present day and closest 2 hours
    if (day === currentDay && currentHour - hour < 2) {
      pastHour = true;
    } else {
      earlierThisWeek = true;
    }
  }
  return [pastHour, earlierThisWeek];
}

function checkForAdds(p5, addedActivities, newness) {
  console.log(addedActivities);

  if (!addedActivities) {
    console.log('no activities yet');
  } else {
    if ('tillverka-aktivitet' in addedActivities) {
      rain = false;
      showThings(
        addedActivities['tillverka-aktivitet'],
        diys,
        'diys',
        1.2,
        imagePositions[2],
        newness
      );
    } else {
      rain = true;
    }
    if ('halsa-pa-nasims-katter' in addedActivities) {
      snow = false;
      showThings(
        addedActivities['halsa-pa-nasims-katter'],
        cats,
        'cats',
        1.32,
        imagePositions[0],
        newness
      );
    } else {
      snow = true;
    }
    if ('te-ritual' in addedActivities) {
      showThings(addedActivities['te-ritual'], teas, 'teas', 0.82, imagePositions[1], newness);
    }
    if ('mykomote' in addedActivities) {
      showMoving(p5, addedActivities['mykomote'], planes, 'planes', 0.6, 0.1, 0.95, 1.55, 65);
    }
    if ('ekonomi' in addedActivities) {
      showMoving(p5, addedActivities['ekonomi'], planes, 'planes', 0.6, 0.1, 0.95, 1.55, 65);
    }
    if ('bli-medlem' in addedActivities) {
      showMoving(p5, addedActivities['bli-medlem'], planes, 'planes', 0.6, 0.1, 0.95, 1.55, 65);
    }
    if ('prata-om-tema' in addedActivities) {
      showParticleSystem(addedActivities['prata-om-tema'], 0.07);
    }

    if ('ekonomi' in addedActivities) {
      showMoving(p5, addedActivities['ekonomi'], planes, 'planes', 0.6, 0.1, 0.95, 1.55, 65);
    }
    if ('gor-ri-byrakrati' in addedActivities) {
      showMoving(
        p5,
        addedActivities['gor-ri-byrakrati'],
        planes,
        'planes',
        0.85,
        0.4,
        0.6,
        3.4,
        150
      );
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

function showParticleSystem(nr, varySize) {
  particleSystem = nr;
  console.log(particleSystem);
  particleSize = proportions[0] * varySize;
}
