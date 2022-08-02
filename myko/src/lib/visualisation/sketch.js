import Particle from './particle';
import ActivityP from './activityParticle';

let hue = 185,
  sat = 90,
  light = 8;
let hues = [5, 300, 245, 185, 125];
let strokeweight;
let prob;
let particles = [];
let addedParts = [];
let newParts = [];

export function windowResized(p5) {
  p5.resizeCanvas(p5.windowWidth, 530);
}

export async function setup(p5) {
  /*let c =*/ p5.createCanvas(p5.windowWidth, 530);

  p5.frameRate(20);
  p5.colorMode(p5.HSL, 360, 100, 100, 1.0);
  p5.noiseSeed(0);

  for (let i = 0; i < 200; i++) {
    particles.push(
      new Particle(
        p5,
        p5.random(p5.width * 1.1),
        p5.random(p5.height * 1.1),
        hues[p5.floor(p5.random(2, 4))]
      )
    );
  }

  const data = await fetchActivityLog(p5);
  checkForAdds(p5, data);

  hues[0] = hue - 180;
  hues[2] = hue + 60;
  hues[3] = hue;
  hues[4] = hue - 60;
}

export function draw(p5) {
  p5.background(hue, sat, light, 0.09);
  p5.translate(p5.width * -0.1, p5.height * -0.1);
  let count = 0;
  /* everpresent background particles*/
  for (let p of particles) {
    count++;
    strokeweight = p5.map(count, 0, particles.length, 1, 30);
    let newHue = p5.floor(p5.map(count, 0, particles.length, 1, 4));
    p.show(strokeweight, 50, hues[newHue]);
    p.update();
    p.edge();
    if (particles.length > 400) {
      particles.splice(0, 1);
    }
  }
  count = 0;
  /* added particles */
  for (let ap of addedParts) {
    count++;
    ap.show(35);
    ap.update();
    ap.edge();
  }

  /* particles added today */
  for (let np of newParts) {
    np.show(99);
    np.speedo(0.8, 84);
    np.update();
    np.edge();
    np.normalSize();
  }
}

async function fetchActivityLog(p5) {
  const response = await fetch('/api/activities/log');
  if (!response.ok) {
    console.log('Could not get activity data');
    return null;
  }

  const logEntries = await response.json();
  //
  checkForNewEntries(p5, logEntries);

  // count the number of each activity
  return logEntries.reduce((result, entry) => {
    if (!(entry.activity in result)) {
      result[entry.activity] = 0;
    }
    result[entry.activity] += 1;
    return result;
  }, {});
}

function checkForNewEntries(p5, logEntries) {
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
    newMovers(p5, nrNewAdds);
    logEntries.shift(0, nrNewAdds);
  } /**/
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
    if ('halsa-pa-nasims-katter' in addedActivs) {
      walking(p5, 2, p5.random(9, 10), 15, addedActivs['halsa-pa-nasims-katter']);
    }
    if ('te-ritual' in addedActivs) {
      walking(p5, 4, p5.random(4, 5), 175, addedActivs['te-ritual']);
    }
    if ('mykomote' in addedActivs) {
      walking(p5, 3, p5.random(5, 6), 50, addedActivs['mykomote']);
    }
    if ('tillverka-aktivitet' in addedActivs) {
      walking(p5, 0, p5.random(7, 8), 1, addedActivs['tillverka-aktivitet']);
    }
    if ('prata-om-tema' in addedActivs) {
      walking(p5, 1, p5.random(6, 7), 0.35, addedActivs['prata-om-tema']);
    }
    if ('gor-ri-byrakrati' in addedActivs) {
      walking(p5, 1, p5.random(8, 9), 250, addedActivs['gor-ri-byrakrati']);
    }
  }
}

// walker animation for added during the current day
function newMovers(p5, nr) {
  let nHue = 0;
  let noise = 100;
  strokeweight = p5.random(8, 12);

  for (let i = 0; i < nr; i++) {
    if (prob > 0.9) {
      newParts.push(
        new ActivityP(
          p5,
          p5.random(p5.width * 0.45, p5.width * 0.5),
          p5.random(p5.height * 0.5, p5.height * 0.55),
          nHue,
          175,
          noise,
          p5.random(-0.5, 0.5)
        )
      );
    } else {
      newParts.push(
        new ActivityP(
          p5,
          p5.random(p5.width * 0.45, p5.width * 0.55),
          p5.random(p5.height * 0.45, p5.height * 0.55),
          nHue,
          strokeweight,
          noise,
          p5.random(-1, 1)
        )
      );
    }
    if (light < 25) {
      light += 0.25;
      sat -= 0.75;
    }
  }
  prob = p5.random(1);
}

//walker animation for added in the past
function walking(p5, particleHue, strokeweight, noise, nr = 1) {
  for (let i = 0; i < nr; i++) {
    let nHue = (hues[particleHue] + nr - i) % 360;

    if (i < 27) {
      addedParts.push(
        new ActivityP(
          p5,
          p5.random(p5.width),
          p5.random(p5.height),
          nHue,
          strokeweight,
          noise,
          p5.random(-2, 2)
        )
      );
    } else if (i > 26 && i < 60) {
      particles.push(new Particle(p5, p5.random(p5.width), p5.random(p5.height), nHue));
    }
    if (hue > 360) {
      hue = 0;
      hue++;
    }
    if (hue <= 360) {
      hue++;
    }
  }
}
