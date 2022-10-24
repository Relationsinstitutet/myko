let mult = 0.004,
  randomH1,
  randomH2;
let points = [];

export function flowfieldSetup(xtraCnvs2) {
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

  randomH1 = xtraCnvs2.random(0, 360);
  randomH2 = (randomH1 + xtraCnvs2.random(45, 110)) % 360;
}

export function flowfieldDraw(xtraCnvs2, flowWeight) {
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

    xtraCnvs2.stroke(h, 85, l, a);

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
