let mult = 0.004,
  randomH1,
  randomH2;
let points = [];

export function flowfieldSetup(trailLayer) {
  trailLayer.angleMode(trailLayer.DEGREES);
  trailLayer.noiseDetail(1);
  let density = 20;
  let space = trailLayer.width / density;
  for (let x = 0; x < trailLayer.width; x += space) {
    for (let y = 0; y < trailLayer.height; y += space) {
      let pointPlace = trailLayer.createVector(
        x + trailLayer.random(-10, 10),
        y + trailLayer.random(-10, 10)
      );
      points.push(pointPlace);
    }
  }
  randomH1 = trailLayer.random(0, 360);
  randomH2 = (randomH1 + trailLayer.random(45, 110)) % 360;
}

export function flowfieldDraw(trailLayer, flowWeight) {
  trailLayer.strokeWeight(flowWeight);
  let inc;
  if (flowWeight < 1) {
    inc = 5;
  } else {
    inc = 1;
  }
  for (let i = 0; i < points.length; i += inc) {
    let h = trailLayer.map(points[i].x, 0, trailLayer.width, randomH1, randomH2);
    let l = trailLayer.map(points[i].y, 0, trailLayer.height, 18, 95);

    let a = trailLayer.map(
      trailLayer.dist(trailLayer.width / 2, trailLayer.height / 2, points[i].x, points[i].y),
      0,
      450,
      1,
      0
    );

    trailLayer.stroke(h, 85, l, a);

    let angle = trailLayer.map(
      trailLayer.noise(points[i].x * mult, points[i].y * mult),
      0,
      1,
      0,
      720
    );
    points[i].add(trailLayer.createVector(trailLayer.cos(angle), trailLayer.sin(angle)));

    if (
      trailLayer.dist(trailLayer.width / 2, trailLayer.height / 2, points[i].x, points[i].y) < 450
    ) {
      trailLayer.point(points[i].x, points[i].y);
    }
  }
}
