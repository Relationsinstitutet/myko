import Pictures from './pictures';
import { MovingPics, Particles } from './moving';
import { prepareWeather } from './weather';
import {
  ratio,
  proportionsByRatio,
  fixBgImagePositions,
  drawBackgroundImages,
  fixImagePositions,
} from './locations';
import { flowfieldDraw, flowfieldSetup } from './flowfield';
import { fetchActivityLog, getWeekDate } from './processData';

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
let snow = false,
  rain = false;
let drops = [];
let weatherSpeed = 1;
let weatherClouds = [];

/* -------FUNCTIONS BEGIN------- */
export function preload(p5) {
  cloud = p5.loadImage('cloud0.png');
  streetlight = p5.loadImage('streetlight.png');
  shelf = p5.loadImage('shelves.png');

  for (let i = 1; i < 3; i++) {
    weatherClouds.push(p5.loadImage(`cloud${i}.png`));
  }
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
  xtraCnvs.stroke(3, 58, 65);

  xtraCnvs2 = p5.createGraphics(p5.windowWidth, p5.windowHeight - 50);
  xtraCnvs2.frameRate(20);
  xtraCnvs2.colorMode(xtraCnvs.HSL, 360, 100, 100, 1.0);

  currentDate = new Date();
  currentWeek = getWeekDate(currentDate);
  xtraCnvs.randomSeed(currentWeek);
  p5.randomSeed(currentWeek);

  flowfieldSetup(xtraCnvs2);
  ratio(p5);

  //----Return foreground image size, strokeweight, flowfield strokeweight
  proportions = proportionsByRatio(xtraCnvs);
  fixBgImagePositions(xtraCnvs);
  drawBackgroundImages(xtraCnvs, cloud, streetlight, shelf);

  //----Mark vertical start & end of canvas
  xtraCnvs.strokeWeight(10);
  xtraCnvs.line(0, 0, p5.width, 0);
  xtraCnvs.line(0, p5.height, p5.width, p5.height);

  //----Return image location arrays; cats, tea, diy, xtra, particles, weathercloud size
  imagePositions = fixImagePositions(p5, proportions[0]);

  const data = await fetchActivityLog(currentDate);
  checkForAdds(p5, data[0], 'new');
  checkForAdds(p5, data[1], 0);
  showAdded();

  if (snow || rain) {
    drops = prepareWeather(
      snow,
      rain,
      imagePositions[5],
      weatherClouds,
      proportions[0],
      p5,
      xtraCnvs
    );
  }

  return canvas;
}

function showAdded() {
  for (const ac of addedThings) {
    ac.show(proportions[1]);
  }
}

export function draw(p5) {
  //----Cutout reveals samtid menu behind canvas----
  p5.background(185, 97, 23, 0.85);
  p5.erase();
  p5.rect(p5.width * 0.5, 125, 227, 36);
  p5.noErase();
  //----Background flowfield animation----
  flowfieldDraw(xtraCnvs2, proportions[2]);

  //----Run additional canvas layers----
  p5.image(xtraCnvs2, p5.width * 0.5, p5.height * 0.5);
  p5.image(xtraCnvs, p5.width * 0.5, p5.height * 0.5);

  //----Moving activity things = planes----
  for (const [index, atm] of addedThingsMove.entries()) {
    atm.update();
    atm.shows(index);
    atm.edge();
  }
  //----Lamp puffs for 'prata-om-tema'----
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
  //----Weather----
  if (drops) {
    for (const drop of drops) {
      drop.show();
      drop.update(weatherSpeed);
      drop.edge();
    }
  }
  //----New Entries----
  for (const [index, na] of newAdds.entries()) {
    na.show(proportions[1]);
    na.grow(index);
  }
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
    //EXPLAINER: arguments passed to showMoving()
    /*
    - canvas layer, 
    - nr of activities,
    - image array name,
    - image name string format (not in use atm how to use: look up pictures.js line 28),
    - image size
    - minvalue variation for initial location (less than 0 = outside canvas)
    - maxvalue variation for initial location (more than 1 = outside canvas)
    - rotation, usage: moving.js, show()
    - noise scale, usage: moving.js, update()
    */
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
