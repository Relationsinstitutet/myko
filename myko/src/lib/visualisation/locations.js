let shelfPosX, shelfPosY, shelfSizeX, shelfSizeY;
let streetPosX, streetPosY, streetSizeX, streetSizeY;
let cloudPosX, cloudPosY, cloudSizeX, cloudSizeY;
let startPos, xInc, yLevel;
let imageSize, strokeWeight, flowfieldStrokeWeight;
let horizontalView = true,
  portrait2x = false;

export function ratio(p5) {
  if (p5.width < p5.height) {
    horizontalView = false;
  }
  if (2 * p5.width < p5.height) {
    portrait2x = true;
  }
}

export function proportionsByRatio(xtraCnvs) {
  flowfieldStrokeWeight = 0.5;
  strokeWeight = 1.2;

  if (horizontalView) {
    flowfieldStrokeWeight = 1;
    strokeWeight = 2.5;
    imageSize = xtraCnvs.width * 0.073;
  } else if (!portrait2x) {
    imageSize = xtraCnvs.width * 0.14;
  } else {
    imageSize = xtraCnvs.width * 0.18;
  }

  let result = [imageSize, strokeWeight, flowfieldStrokeWeight];
  return result;
}

export function fixBgImagePositions(xtraCnvs) {
  shelfPosX = xtraCnvs.width * -0.1;
  shelfPosY = xtraCnvs.height * 0.5;
  shelfSizeX = xtraCnvs.width * 0.67;
  shelfSizeY = xtraCnvs.height * 0.46;
  streetPosX = xtraCnvs.width * 0.7;
  streetPosY = xtraCnvs.windowHeight * 0.3;
  streetSizeX = xtraCnvs.width * 0.4;
  streetSizeY = xtraCnvs.height * 0.85;
  cloudPosY = xtraCnvs.height * 0.32;

  if (horizontalView) {
    streetSizeX = xtraCnvs.width * 0.15;
    streetSizeY = xtraCnvs.height * 1.1;
    streetPosX = xtraCnvs.width * 0.6;
    streetPosY = xtraCnvs.height * 0.25;
    cloudSizeX = xtraCnvs.width * 0.48;
    cloudSizeY = xtraCnvs.height * 0.9;
    cloudPosX = xtraCnvs.width * 0.53;
    cloudPosY = xtraCnvs.height * 0.15;
    shelfSizeX = xtraCnvs.width * 0.5;
    shelfSizeY = xtraCnvs.height * 0.75;
    shelfPosX = xtraCnvs.width * -0.05;
    shelfPosY = xtraCnvs.height * 0.3;
  } else if (!portrait2x) {
    cloudSizeX = xtraCnvs.width * 0.85;
    cloudSizeY = xtraCnvs.width * 0.9;
    cloudPosX = xtraCnvs.width * 0.4;
  } else {
    cloudSizeX = xtraCnvs.width * 1;
    cloudSizeY = xtraCnvs.width * 1.2;
    cloudPosX = xtraCnvs.width * 0.38;
  }
}

export function drawBackgroundImages(xtraCnvs, cloud, streetlight, shelf) {
  //streetlight
  xtraCnvs.image(streetlight, streetPosX, streetPosY, streetSizeX, streetSizeY);
  //cloud
  xtraCnvs.image(cloud, cloudPosX, cloudPosY, cloudSizeX, cloudSizeY);
  //shelf
  xtraCnvs.image(shelf, shelfPosX, shelfPosY, shelfSizeX, shelfSizeY);
}

export function fixImagePositions(xtraCnvs, size) {
  let cloudTop = cloudPosY + cloudSizeY * 0.29;
  let cloud2Top = cloudPosY + cloudSizeY * 0.41;
  let cloud3Top = cloudPosY + cloudSizeY * 0.57;
  let cloudLeft = cloudPosX + cloudSizeX * 0.17;
  let cloudRight = cloudPosX + cloudSizeX * 0.62;
  let catLoc = [
    [xtraCnvs.width * 0.75, cloudTop],
    [cloudLeft, cloud2Top],
    [cloudRight, cloud2Top],
    [cloudLeft, cloud3Top],
    [cloudRight, cloud3Top],
    [xtraCnvs.width * 0.725, cloud3Top],
    [xtraCnvs.width * 0.13, xtraCnvs.height - size * 0.46],
    [xtraCnvs.width * 0.34, xtraCnvs.height - size * 0.46],
    [xtraCnvs.width * 0.51, xtraCnvs.height - size * 0.46],
    [xtraCnvs.width * 0.66, xtraCnvs.height - size * 0.46],
    [xtraCnvs.width * 0.8, xtraCnvs.height - size * 0.46],
    [xtraCnvs.width * 0.92, xtraCnvs.height - size * 0.46],
  ];

  startPos = xtraCnvs.width * 0.015;
  xInc = xtraCnvs.width * 0.045;
  yLevel = xtraCnvs.height;
  let teaLoc = [
    [startPos, xtraCnvs.height * 0.18],
    [xInc, yLevel * 0.06],
    [xInc * 2, yLevel * 0.12],
    [xInc * 3, yLevel * 0.22],
    [xInc * 4, yLevel * 0.1],
    [xInc * 5, yLevel * 0.04],
    [xInc * 6, yLevel * 0.28],
    [xInc * 7, yLevel * 0.2],
    [xInc * 8, yLevel * 0.06],
    [xInc * 9, yLevel * 0.26],
    [xInc * 17, yLevel * 0.16],
    [xInc * 18, yLevel * 0.1],
  ];
  let topShelfY = shelfPosY + shelfSizeY * 0.2;
  let secondShelfY = shelfPosY + shelfSizeY * 0.44;
  let midShelfY = shelfPosY + shelfSizeY * 0.65;
  let fourthShelfY = shelfPosY + shelfSizeY * 0.85;
  let leftShelf = shelfPosX + shelfSizeX * 0.23;
  let midShelf = shelfPosX + shelfSizeX * 0.48;
  let rightShelf = shelfPosX + shelfSizeX * 0.75;
  let diyLoc = [
    [leftShelf, topShelfY],
    [midShelf, topShelfY],
    [rightShelf, topShelfY],
    [leftShelf, secondShelfY],
    [midShelf, secondShelfY],
    [rightShelf, secondShelfY],
    [leftShelf, midShelfY],
    [midShelf, midShelfY],
    [rightShelf, midShelfY],
    [leftShelf, fourthShelfY],
    [midShelf, fourthShelfY],
    [rightShelf, fourthShelfY],
  ];

  let overShelfY = shelfPosY - shelfSizeY * 0.019;
  let xtraLoc = [
    [shelfPosX + shelfSizeX * 0.28, overShelfY],
    [xtraCnvs.width * 0.25, yLevel * 0.17],
    [shelfPosX + shelfSizeX * 0.52, overShelfY],
    [xtraCnvs.width * 0.57, xtraCnvs.height * 0.62],
    [shelfPosX + shelfSizeX * 0.6, cloudPosY + cloudSizeY * 0.3],
    [xtraCnvs.width * 0.8, yLevel * 0.13],
    [xtraCnvs.width * 0.58, yLevel * 0.08],
    [leftShelf, overShelfY],
    [leftShelf, overShelfY],
    [xtraCnvs.width * 0.3, yLevel * 0.25],
  ];

  //let particleLoc = [xtraCnvs.width * 0.5, xtraCnvs.height * 0.5];
  let particleLoc = [streetPosX + streetSizeX * 0.5, streetPosY - streetSizeY * 0.02];

  let result = [catLoc, teaLoc, diyLoc, xtraLoc, particleLoc];
  return result;
}
