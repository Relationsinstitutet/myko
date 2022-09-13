import Particle from './particle';
import ActivityP from './activityParticle';
import p5Svelte from 'p5-svelte';
import { linear } from 'svelte/easing';

class Images {
  constructor(p5, type, size, location = [2, 2]) {
    this.type = type;
    this.p5 = p5;
    this.location = location;
    this.size = size;
  }
  show(nr) {
    let randomSize = this.p5.random(135, 155);
    let randomIncrease = this.p5.random(2.75, 3.5);

    let adress = this.type[0];
    console.log(adress);
    this.type.push(this.type.shift()); /**/
    /*let adress;*/
    if (this.type === cats) {
      this.p5.loadImage(adress, (img) => {
        this.p5.image(img, this.location[0], this.location[1], this.size, this.size);
      });
    } else if (this.type === buttons) {
      this.p5.loadImage(adress, (img) => {
        this.p5.tint(255, 255 - nr * 9);
        this.p5.image(
          img,
          this.p5.random(this.p5.width * 0.015, this.p5.width * 0.05) + nr * 50,
          this.p5.random(
            this.p5.height * (this.location[0] - 0.05),
            this.p5.height * (this.location[1] + 0.2)
          ),
          randomSize - nr * randomIncrease,
          randomSize - nr * randomIncrease
        );
      });
    } else if (this.type === teas) {
      this.p5.loadImage(adress, (img) => {
        this.p5.image(img, this.location[0], this.location[1], this.size, this.size);
      });
    }
  }
}

let addedThings = [];
let cloud;
let catLocations;
let teaLocations;

const teas = ['teacup.png', 'teapot3.png', 'teapot4.png', 'teapot5.png'];
const cats = ['cat1.png', 'cat2.png', 'cat3.png', 'cat4.png', 'cat5.png', 'cat6.png'];
const buttons = [
  'button0.png',
  'button1.png',
  'button2.png',
  'button3.png',
  'button4.png',
  'button5.png',
  'button6.png',
  'button7.png',
  'button8.png',
  'button9.png',
  'buttonb0.png',
  'buttonb1.png',
];
let addedCats = [];
let addedTeas = [];
let addedButtons = [];

export function preload(p5) {
  cloud = p5.loadImage('cloud0.png');
}

export function windowResized(p5) {
  p5.resizeCanvas(p5.windowWidth, p5.windowHeight - 170);
}

export async function setup(p5) {
  p5.createCanvas(p5.windowWidth, p5.windowHeight - 170);

  p5.frameRate(20);
  //p5.colorMode(p5.HSL, 360, 100, 100, 1.0);

  p5.strokeWeight(5);
  p5.stroke(3, 77, 84);
  p5.line(0, 0, p5.width, 0);

  let cloudwidth = p5.width * 0.44;
  p5.image(cloud, p5.width * 0.6, p5.height * 0.2, cloudwidth, 400);

  arrayLocations(p5);
  //showImages(p5, catLocations, teaLocations);

  const data = await fetchActivityLog(p5);
  checkForAdds(p5, data);
  showAdded();
  /*
  p5.noiseSeed(0);p5.background(h, s, l, 1);
  */
}

function arrayLocations(p5) {
  let catLoc = [
    [p5.width * 0.74, p5.height * 0.2],
    [p5.width * 0.83, p5.height * 0.28],
    [p5.width * 0.7, p5.height * 0.33],
    [p5.width * 0.65, p5.height * 0.465],
    [p5.width * 0.89, p5.height * 0.48],
    [p5.width * 0.79, p5.height * 0.49],
    [p5.width * 0.7, p5.height * 0.76],
    [p5.width * 0.59, p5.height * 0.77],
    [p5.width * 0.82, p5.height * 0.76],
    [p5.width * 0.91, p5.height * 0.76],
  ];
  let teaLoc = [
    [p5.width * 0.0035, p5.height * 0.14],
    [p5.width * 0.045, p5.height * 0.05],
    [p5.width * 0.09, p5.height * 0.17],
    [p5.width * 0.135, p5.height * 0.26],
    [p5.width * 0.18, p5.height * 0.1],
    [p5.width * 0.22, p5.height * 0.2],
    [p5.width * 0.27, p5.height * 0.12],
    [p5.width * 0.32, p5.height * 0.03],
    [p5.width * 0.37, p5.height * 0.17],
    [p5.width * 0.42, p5.height * 0.07],
  ];

  catLocations = [...catLoc];
  teaLocations = [...teaLoc];
}

function showImages(p5, catLocations, teaLocations) {
  for (let i = 0; i < 10; i++) {
    p5.loadImage(cats[i % cats.length], (thoughtcat) => {
      p5.tint(255, 190 + i * 5);
      p5.image(
        thoughtcat,
        catLocations[i][0],
        catLocations[i][1],
        130,
        130

        /*p5.random(p5.width * 0.05, p5.width * 0.8),
        p5.random(p5.height * 0.22, p5.height * 0.28) + i * 7,
        randomButton + 5 - i * randomIncrease,
        randomButton + 45 - i * randomIncrease*/
      );
    });

    p5.loadImage(teas[i % teas.length], (tee) => {
      p5.tint(255, 190 + i * 5);
      p5.image(tee, teaLocations[i][0], teaLocations[i][1], 115, 115);
      p5.line(teaLocations[i][0] + 57, teaLocations[i][1] + 5, teaLocations[i][0] + 57, 0);
    });
  }
  //need to shuffle cat images and not location array probably, so that stuff further up will sit in the back, to look more true to life
  p5.shuffle(catLocations, true);
}

function showAdded() {
  let index = 0;
  for (const ac of addedThings) {
    index++;
    ac.show(index);
    console.log(ac, index);
  }
}

export function draw(p5) {
  /* p5.translate(p5.width * -0.1, p5.height * -0.1);let count = 0;
  /* everpresent background particles
  for (let p of particles) {
    count++;
    w = p5.map(count, 0, particles.length, 1, 30);
    let nh = p5.floor(p5.map(count, 0, particles.length, 1, 4));
    p.show(w, 50, hues[nh]);
    p.update();
    p.edge();
    if (particles.length > 400) {
      particles.splice(0, 1);
    }
  }
  count = 0;
  /* added particles
  for (let ap of addedParts) {
    count++;
    ap.show(35);
    ap.update();
    ap.edge();
  }*/
  /* particles added today 
  for (let np of addedParts) {
    
    /* np.show(99);np.speedo(0.8, 84);
    np.update();
    np.edge();
    np.normalSize();}*/
}

async function fetchActivityLog(p5) {
  const response = await fetch('/api/aktiviteter/logg');
  if (!response.ok) {
    console.log('Could not get activity data');
    return null;
  }

  const logEntries = await response.json();

  //
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

/*function checkForNewEntries(p5, logEntries) {
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
  } 
}

function isNewDate(entryDate, todayDate) {
  if (
    entryDate.getDate() === todayDate.getDate() &&
    entryDate.getMonth() === todayDate.getMonth()
  ) {
    return true;
  }
}*/

function checkForAdds(p5, addedActivs) {
  console.log(addedActivs);

  if (!addedActivs) {
    console.log('no activities yet');
  } else {
    if ('tillverka-aktivitet' in addedActivs) {
      showThings(p5, addedActivs['tillverka-aktivitet'], buttons);
      //showButtons(p5, addedActivs['tillverka-aktivitet']);
    }
    if ('halsa-pa-nasims-katter' in addedActivs) {
      //showThings(p5, addedActivs['halsa-pa-nasims-katter'], cats, 0.3);
      showCats(p5, addedActivs['halsa-pa-nasims-katter']);
    }
    if ('te-ritual' in addedActivs) {
      //showThings(p5, addedActivs['te-ritual'], teas, 0.05);
      showTea(p5, addedActivs['te-ritual']);
    }
    if ('mykomote' in addedActivs) {
      walking(p5, 3, p5.random(5, 6), 50, addedActivs['mykomote']);
    }

    if ('prata-om-tema' in addedActivs) {
      walking(p5, 1, p5.random(6, 7), 0.35, addedActivs['prata-om-tema']);
    }
    if ('gor-ri-byrakrati' in addedActivs) {
      walking(p5, 1, p5.random(8, 9), 250, addedActivs['gor-ri-byrakrati']);
    }
  }
}

function showThings(p5, nr, type) {
  for (let i = 0; i < nr; i++) {
    addedThings.push(new Images(p5, type, p5.random(100, 155)));
  }
}

function showCats(p5, nr) {
  for (let i = 0; i < nr; i++) {
    addedThings.push(new Images(p5, cats, 130, catLocations[i]));
  }
}

function showTea(p5, nr) {
  for (let i = 0; i < nr; i++) {
    addedThings.push(new Images(p5, teas, 110, teaLocations[i]));
  }
}

function showButtons(p5, nr) {
  for (let i = 0; i < nr; i++) {
    let buttonadress = buttons[i % buttons.length];
    addedThings.push(new Images(p5, 'button', buttonadress, 3));
    /*let thisbutton;
    
    addedButtons.push(
      p5.loadImage(buttonadress, (thisbutton) => {
        p5.image(thisbutton, p5.random(p5.width), p5.random(p5.height));
      })
    );*/
  }
}
// walker animation for added during the current day
/*function newMovers(p5, nr) {
  let nHue = 0;
  let ns = 100;
  w = p5.random(8, 12);

  for (let i = 0; i < nr; i++) {
    if (prob > 0.9) {
      newParts.push(
        new ActivityP(
          p5,
          p5.random(p5.width * 0.45, p5.width * 0.5),
          p5.random(p5.height * 0.5, p5.height * 0.55),
          nHue,
          175,
          ns,
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
          w,
          ns,
          p5.random(-1, 1)
        )
      );
    }
    if (l < 25) {
      l += 0.25;
      s -= 0.75;
    }
  }
  prob = p5.random(1);
}*/

//walker animation for added in the past
/*function walking(p5, hue, w, ns, nr = 1) {
  for (let i = 0; i < nr; i++) {
    let nHue = (hues[hue] + nr - i) % 360;

    if (i < 26) {
      addedParts.push(
        new ActivityP(p5, p5.random(p5.width), p5.random(p5.height), nHue, w, ns, p5.random(-2, 2))
      );
    } else if (i > 25 && i < 60) {
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
}*/
