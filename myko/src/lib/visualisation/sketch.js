import Particle from './particle';
import ActivityP from './activityParticle';

let h = 185,
  s = 90,
  l = 8;
let hues = [5, 300, 245, 185, 125];
let w;
let prob;
let particles = [];
let addedParts = [];
let newParts = [];

export async function setup(p5) {
  p5.createCanvas(300, 450);

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

  const data = await fetchActivityLog();
  checkForAdds(p5, data);

  hues[0] = h - 180;
  hues[2] = h + 60;
  hues[3] = h;
  hues[4] = h - 60;
}

export function draw(p5) {
  p5.background(h, s, l, 0.09);
  p5.translate(p5.width * -0.1, p5.height * -0.1);
  let count = 0;
  for (let p of particles) {
    count++;
    w = p5.map(count, 0, particles.length, 1, 30);
    let nh = p5.floor(p5.map(count, 0, particles.length, 1, 4));
    p.show(w, 50, hues[nh]);
    p.update();
    p.edge();
    if (particles.length > 380) {
      particles.splice(0, 1);
    }
  }
  count = 0;
  for (let ap of addedParts) {
    count++;
    ap.show(35);
    ap.update();
    ap.edge();
  }

  for (let np of newParts) {
    np.show(99);
    np.speedo(0.8, 80);
    np.update();
    np.edge();
    np.normalSize();
  }
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
      walking(p5, 2, p5.random(8, 10), 5, addedActivs['say-hello-to-nasims-cat']);
    }
    if ('te-ritual' in addedActivs) {
      walking(p5, 4, p5.random(4.75, 5.5), 320, addedActivs['te-ritual']);
    }
  }
}

//walker animation for just added & added in the past
function walking(p5, hue, w, ns, nr = 1) {
  for (let i = 0; i < nr; i++) {
    let nHue = (hues[hue] + nr - i) % 360;

    if (nr < 2) {
      if (prob > 0.92) {
        newParts.push(
          new ActivityP(
            p5,
            p5.random(p5.width * 0.45, p5.width * 0.5),
            p5.random(p5.height * 0.5, p5.height * 0.55),
            nHue,
            175,
            ns
          )
        );
      } else {
        newParts.push(
          new ActivityP(
            p5,
            p5.random(p5.width * 0.45, p5.width * 0.55),
            p5.random(p5.height * 0.45, p5.height * 0.55),
            nHue,
            w,
            ns
          )
        );
      }
      if (l < 25) {
        l += 0.25;
        s -= 0.75;
      }
    } else if (nr > 1 && i < 16) {
      addedParts.push(new ActivityP(p5, p5.random(p5.width), p5.random(p5.height), nHue, w, ns));
    } else if (i > 15 && i < 75) {
      particles.push(new Particle(p5, p5.random(p5.width), p5.random(p5.height), nHue));
    }
    if (h > 360) {
      h = 0;
      h++;
    }
    if (h <= 360) {
      h++;
    }
  }
}
