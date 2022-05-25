let colours = ["#252566", "#9038d9", "#9e9682", "#8b739c", "#cc8c25", "#ebad1c", "#B599cC"];  //[2], #756F60
let xSpace = 1.15;
let nCols, nRows;
let w, c;
let particles = [];
let shortParts = [];
let incr = 0.1;
let meditate = 0,
  tea = 0, talk = 0;
let fr;

function setup() {
  const c = createCanvas(300, 450);
  c.parent('canvasContainer');

  frameRate(20);
  fr = createP("");
  fr.style("color", colours[2]);
  noStroke();
  noiseSeed(0);


  //!Rensa local storage -> kör denna 1x!
  //clearLoStore();

  for (let i = 0; i < 300; i++) {
    particles[i] = new Particle(
      random(width * xSpace),
      random(height * xSpace),
      colours[floor(random(2, 4))], 40, 2, 0.5
    );
  }
  checkForAdds();
}

function draw() {
  background(43,23,15,18);//7,4,40  235,255,242
  translate(width * -0.1, height * -0.1);
  let count = 0;
  /**/ for (let p of particles) {
    count++;
    w = map(count, 0, particles.length, 1, 4);
    p.show(w);
    p.update();
    p.edge();
    if(particles.length > 300) {
      particles.splice(0,1);
    }
  }

  for(let sp of shortParts) {
    sp.show(w + 3);
    sp.update();
    sp.follow();
    sp.edge();
  }

  fr.html(floor(frameRate()));
}

  function checkForAdds() {
  const addedActivs = JSON.parse(localStorage.getItem("prevActivsTr"));
  console.log(addedActivs);

  if (!addedActivs) {
    console.log("no activities yet");
  } else {
    if (addedActivs.med) {
      meditate = addedActivs.med;
      //walkers(meditate, 0);
      walking(30, 1, 65, 0.55, meditate);
    }
    if (addedActivs.tea) {
      tea = addedActivs.tea;
      //walkers(tea, 4, 1.5, 200);
      walking(60, 4, 65, 0.65, tea);
    }
    if (addedActivs.tal) {
      tea = addedActivs.tal;
      //walkers(tea, 4, 1.5, 200);
      trailing(50, 4, 65, 0.7, talk);
    }
  }
}


//on btn click get choice, add to storage var, send to create
function parseAct(e) {
  e.preventDefault();
  let actId = document.querySelector('input[name="activ"]:checked').value;

  if (actId === "medit") {
    walking(5, 0, 100, 0.9);
    meditate++;
  } else if (actId === "tea") {
    walking(20, 5, 100, 0.85);
    tea++;
  } else if (actId === "talk") {
    trailing(350, 5, 100, 0.7);
    talk++;
  } else {
    console.log("nope");
  }
  sendAction(meditate, tea, talk);
}


//send changed vars to localstorage
function sendAction(meditate, tea, talk) {
  let activity = {
    med: meditate,
    tea: tea,
    tal: talk
  };
  localStorage.setItem("prevActivsTr", JSON.stringify(activity));
}


//walker animation for both just added and added in the past, just send less vibrant color for the past ones + less different path?
function walking(ns, c, a, s, nr = 1) {
  //maybe its own array instead, but should be in draw() in that case
  for(let i = 0; i < nr; i++) {
    particles.push(new Particle(random(width), random(height), colours[c], a, ns, s));
  }
}

function trailing(ns, c, a, s, nr = 1) {
  //maybe its own array instead, but should be in draw() in that case
  for(let i = 0; i < nr; i++) {
    shortParts.push(new Particle(random(width), random(height), colours[c], a, ns, s));
  }
}


function clearLoStore() {
  localStorage.clear();
}

/*
      let angleBg = noise(xoff, yoff, zoff) * TWO_PI * xr;
      let v = p5.Vector.fromAngle(angleBg);
      xoff += inc;

      push();
      translate(x * res, y * res);

      rotate(v.heading());
      line(0,0,res,0);
      pop();
    }
    yoff += inc;
    zoff += 0.001;
  }*/
/*
  let gridPos = 5;
  for(let y = 0; y < rows; y++) {
    for(let x = 0; x < cols; x++) {
      if(x % gridPos  === 0) {
        if(y % gridPos === 0) {
          particles[x] = new Particle((x + (gridPos/2)) * res, (y + gridPos/2) * res);
        }
      }}}*/

/*
  let largerW = (width * xSpace) - (width * (width - xSpace));
  let largerH = (height * xSpace) - (height * (height - xSpace));
  nCols = floor(largerW/res);
  nRows = floor(largerH/res);
  defA = PI * 0.25;
  */
