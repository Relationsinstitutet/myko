import Pictures from './pictures';
import { MovingPics, Particles } from './moving';
import { prepareDrops, makeWind } from './weather';
import {
  ratio,
  proportionsByRatio,
  fixBgImagePositions,
  drawBackgroundImages,
  fixImagePositions,
} from './locations';
import { flowfieldDraw, flowfieldSetup } from './flowfield';
import { fetchActivityLog, getWeekDate } from './processData';

let canvas, staticLayer, trailLayer;
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
let leaves = [];
let greenTurtles = [];
let yellowTurtles = [];
let particleSystem, particleSize, p;
let snow = false,
  rain = false,
  wind = false;
let drops = [],
  grass = [];
let weatherSpeed = 1;
let umbrella;
let weatherClouds = [];

/* -------FUNCTIONS BEGIN------- */
export function preload(p5) {
  cloud = p5.loadImage('cloud0.png');
  streetlight = p5.loadImage('streetlight.png');
  shelf = p5.loadImage('shelves.png');
  umbrella = p5.loadImage('umbrella.png');

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
  for (let i = 1; i < 4; i++) {
    leaves.push(p5.loadImage(`leaf${i}.png`));
  }
  planes.push(p5.loadImage('paperplane.png'));
  greenTurtles.push(p5.loadImage('turtlegreen.png'));
  yellowTurtles.push(p5.loadImage('turtleyellow.png'));
}

export function windowResized(p5) {
  p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
}

export async function setup(p5) {
  canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight - 50);

  currentDate = new Date();
  currentWeek = getWeekDate(currentDate);

  p5.pixelDensity(1);
  p5.frameRate(20);
  p5.randomSeed(currentWeek);
  p5.imageMode(p5.CENTER);
  p5.rectMode(p5.CENTER);
  p5.colorMode(p5.HSL, 360, 100, 100, 1.0);
  p5.stroke(185, 94, 10, 1);

  staticLayer = p5.createGraphics(p5.windowWidth, p5.windowHeight - 50);
  staticLayer.randomSeed(currentWeek);
  staticLayer.colorMode(p5.HSL, 360, 100, 100, 1.0);
  staticLayer.stroke(185, 94, 10, 1);

  trailLayer = p5.createGraphics(p5.windowWidth, p5.windowHeight - 50);
  trailLayer.colorMode(trailLayer.HSL, 360, 100, 100, 1.0);

  flowfieldSetup(trailLayer);
  ratio(p5);

  //----Return foreground image size, strokeweight, flowfield strokeweight
  proportions = proportionsByRatio(staticLayer);
  fixBgImagePositions(staticLayer);
  drawBackgroundImages(staticLayer, cloud, streetlight, shelf);

  //----Mark vertical start & end of canvas
  staticLayer.strokeWeight(10);
  staticLayer.line(0, 0, p5.width, 0);
  staticLayer.line(0, p5.height, p5.width, p5.height);

  //----Return image location arrays; cats, tea, diy, xtra, particles, weathercloud size
  imagePositions = fixImagePositions(p5, proportions[0]);

  const data = await fetchActivityLog(currentDate);
  checkForAdds(p5, data);
  showAdded();

  if (wind) {
    grass = makeWind(p5);
  }
  if (snow || rain) {
    drops = prepareDrops(
      snow,
      rain,
      imagePositions[5],
      p5,
      weatherClouds,
      proportions[0],
      staticLayer
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
  flowfieldDraw(trailLayer, proportions[2]);

  //----Run additional canvas layers----
  p5.image(trailLayer, p5.width * 0.5, p5.height * 0.5);
  p5.image(staticLayer, p5.width * 0.5, p5.height * 0.5);

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
  if (drops.length) {
    for (const drop of drops) {
      drop.show();
      drop.update(weatherSpeed);
      drop.hover(umbrella);
      drop.edge();
    }
  }
  if (grass.length) {
    for (const blade of grass) {
      blade.update();
    }
  }

  //----New Entries----
  for (const [index, na] of newAdds.entries()) {
    na.show(proportions[1]);
    na.grow(index);
  }
}

function checkForAdds(p5, addedActivities) {
  console.log(addedActivities);

  if (!addedActivities) {
    console.log('no activities yet');
  } else {
    if ('tillverka-aktivitet' in addedActivities) {
      wind = false;
      showThings(
        addedActivities['tillverka-aktivitet'],
        diys,
        'diys',
        1.2,
        imagePositions[2],
        addedActivities['tillverka-aktivitet-new'],
        p5
      );
    } else {
      wind = true;
    }
    if ('halsa-pa-nasims-katter' in addedActivities) {
      snow = false;
      showThings(
        addedActivities['halsa-pa-nasims-katter'],
        cats,
        'cats',
        1.32,
        imagePositions[0],
        addedActivities['halsa-pa-nasims-katter-new'],
        p5
      );
    } else {
      snow = true;
    }
    if ('te-ritual' in addedActivities) {
      rain = false;
      showThings(
        addedActivities['te-ritual'],
        teas,
        'teas',
        0.82,
        imagePositions[1],
        addedActivities['te-ritual-new'],
        p5
      );
    } else {
      rain = true;
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
      showMoving(
        p5,
        addedActivities['ekonomi'],
        yellowTurtles,
        'yellowTurtles',
        0.6,
        0.1,
        0.95,
        1.55,
        65
      );
    }
    if ('bli-medlem' in addedActivities) {
      showMoving(
        p5,
        addedActivities['bli-medlem'],
        greenTurtles,
        'greenTurtles',
        0.6,
        0.1,
        0.95,
        1.55,
        65
      );
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
    if ('arsmote' in addedActivities) {
      showMoving(p5, addedActivities['arsmote'], leaves, 'leaves', 0.72, 0.15, 0.65, 1.5, 600);
    }
  }
}

function showThings(nr, type, typeName, varySize, locations, newness, p5) {
  //for (let i = 0; i < nr; i++) {
  let bigNr = p5.floor(nr / 10);
  let smallNr = nr % 10;
  let compNr = Array(bigNr + smallNr);
  compNr.fill(varySize, 0, smallNr + 1);
  compNr.fill(varySize * 1.75, smallNr, smallNr + bigNr);
  for (let i = compNr.length - 1; i >= 0; i--) {
    //for (let i = 0; i < compNr.length; i++) {
    if (i >= locations.length) {
      /*addedThings.push(
        new Pictures(type, proportions[0] * varySize, typeName, staticLayer, imagePositions[3], i)
      );*/
      if (!newness || i >= newness) {
        addedThings.push(
          new Pictures(
            type,
            proportions[0] * compNr[i],
            typeName,
            staticLayer,
            imagePositions[3],
            i
          )
        );
      } else {
        console.log('new');
        newAdds.push(
          new Pictures(type, proportions[0] * compNr[i], typeName, p5, imagePositions[3], i, 50)
        );
      }
    } else {
      if (!newness || i >= newness) {
        addedThings.push(
          new Pictures(type, proportions[0] * compNr[i], typeName, staticLayer, locations, i)
        );
      } else {
        console.log('new', i);
        newAdds.push(
          new Pictures(type, proportions[0] * compNr[i], typeName, p5, locations, i, 50)
        );
      }
    }
  }
}

function showMoving(p5, nr, type, typeName, varySize, location1, location2, rotation, noiseScl) {
  let bigNr = p5.floor(nr / 10);
  let smallNr = nr % 10;
  let compNr = Array(bigNr + smallNr);
  compNr.fill(varySize, 0, smallNr + 1);
  compNr.fill(varySize * 1.75, smallNr, smallNr + bigNr);
  for (let i = 0; i < compNr.length; i++) {
    addedThingsMove.push(
      new MovingPics(
        type,
        proportions[0] * compNr[i],
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
  particleSize = proportions[0] * varySize;
}
