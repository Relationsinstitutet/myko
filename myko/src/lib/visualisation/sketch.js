import Particle from './particle';

let colours = ['#252566', '#9038d9', '#9e9682', '#8b739c', '#cc8c25', '#ebad1c', '#B599cC']; //[2], #756F60
let xSpace = 1.15;
let nCols, nRows;
let w, c;
let particles = [];
let shortParts = [];
let incr = 0.1;
let meditate = 0,
  tea = 0,
  talk = 0;
let fr;

export function windowResized(p5) {
  p5.resizeCanvas(p5.windowWidth, 530);
  //console.log('heya');
}

export async function setup(p5) {
  //let adjWidth = p5.windowWidth * 0.9;
  let c = p5.createCanvas(p5.windowWidth, 530);
  //let adjPos = p5.windowWidth * 0.05;
  //c.position(adjPos, adjPos);
  //c.style('z-index', '-1');

  p5.frameRate(20);
  fr = p5.createP('');
  fr.style('color', colours[2]);
  p5.noStroke();
  p5.noiseSeed(0);

  for (let i = 0; i < 300; i++) {
    particles[i] = new Particle(
      p5,
      p5.random(p5.width * xSpace),
      p5.random(p5.height * xSpace),
      colours[p5.floor(p5.random(2, 4))],
      40,
      2,
      0.5
    );
  }

  const data = await fetchActivityLog();
  checkForAdds(p5, data);
}

export function draw(p5) {
  p5.background(43, 23, 15, 18); //7,4,40  235,255,242
  p5.translate(p5.width * -0.1, p5.height * -0.1);
  let count = 0;
  /**/ for (let p of particles) {
    count++;
    w = p5.map(count, 0, particles.length, 1, 4);
    p.show(w);
    p.update();
    p.edge();
    if (particles.length > 300) {
      particles.splice(0, 1);
    }
  }

  for (let sp of shortParts) {
    sp.show(p5.w + 3);
    sp.update();
    sp.follow();
    sp.edge();
  }

  fr.html(p5.floor(p5.frameRate()));
}

async function fetchActivityLog() {
  const response = await fetch('/api/activities/log');
  if (!response.ok) {
    console.log('Could not get activity data');
    return null;
  }

  const logEntries = await response.json();
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
    if ('say-hello-to-nasims-cat' in addedActivs) {
      //walkers(meditate, 0);
      walking(p5, 30, 1, 65, 0.55, addedActivs['say-hello-to-nasims-cat']);
    }
    if ('te-ritual' in addedActivs) {
      //walkers(tea, 4, 1.5, 200);
      walking(p5, 60, 4, 65, 0.65, addedActivs['te-ritual']);
    }
  }
}

//walker animation for both just added and added in the past, just send less vibrant color for the past ones + less different path?
function walking(p5, ns, c, a, s, nr = 1) {
  //maybe its own array instead, but should be in draw() in that case
  for (let i = 0; i < nr; i++) {
    particles.push(
      new Particle(p5, p5.random(p5.width), p5.random(p5.height), colours[c], a, ns, s)
    );
  }
}
