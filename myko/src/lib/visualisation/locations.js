let shelfPosX, shelfPosY, shelfSizeX, shelfSizeY;
let streetPosX, streetPosY, streetSizeX, streetSizeY;
let cloudPosX, cloudPosY, cloudSizeX, cloudSizeY;
let rainCloudSizeX, rainCloudSizeY;
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

export function proportionsByRatio(staticLayer) {
  flowfieldStrokeWeight = 0.5;
  strokeWeight = 1.2;

  if (horizontalView) {
    flowfieldStrokeWeight = 1;
    strokeWeight = 2.5;
    imageSize = staticLayer.width * 0.073;
  } else if (!portrait2x) {
    imageSize = staticLayer.width * 0.14;
  } else {
    imageSize = staticLayer.width * 0.18;
  }

  let result = [imageSize, strokeWeight, flowfieldStrokeWeight];
  return result;
}

export function fixBgImagePositions(staticLayer) {
  shelfPosX = staticLayer.width * -0.1;
  shelfPosY = staticLayer.height * 0.5;
  shelfSizeX = staticLayer.width * 0.67;
  shelfSizeY = staticLayer.height * 0.46;
  streetPosX = staticLayer.width * 0.7;
  streetPosY = staticLayer.windowHeight * 0.3;
  streetSizeX = staticLayer.width * 0.4;
  streetSizeY = staticLayer.height * 0.85;
  cloudPosY = staticLayer.height * 0.32;

  if (horizontalView) {
    streetSizeX = staticLayer.width * 0.15;
    streetSizeY = staticLayer.height * 1.1;
    streetPosX = staticLayer.width * 0.6;
    streetPosY = staticLayer.height * 0.25;
    cloudSizeX = staticLayer.width * 0.48;
    cloudSizeY = staticLayer.height * 0.9;
    cloudPosX = staticLayer.width * 0.53;
    cloudPosY = staticLayer.height * 0.15;
    shelfSizeX = staticLayer.width * 0.5;
    shelfSizeY = staticLayer.height * 0.75;
    shelfPosX = staticLayer.width * -0.05;
    shelfPosY = staticLayer.height * 0.3;
    rainCloudSizeX = staticLayer.width * 0.3;
    rainCloudSizeY = staticLayer.height * 0.45;
  } else if (!portrait2x) {
    cloudSizeX = staticLayer.width * 0.85;
    cloudSizeY = staticLayer.width * 0.9;
    cloudPosX = staticLayer.width * 0.4;
    rainCloudSizeX = staticLayer.width * 0.47;
    rainCloudSizeY = staticLayer.width * 0.4;
  } else {
    cloudSizeX = staticLayer.width * 1;
    cloudSizeY = staticLayer.width * 1.2;
    cloudPosX = staticLayer.width * 0.38;
    rainCloudSizeX = staticLayer.width * 0.55;
    rainCloudSizeY = staticLayer.width * 0.6;
  }
}

export function drawBackgroundImages(staticLayer, cloud, streetlight, shelf) {
  //streetlight
  staticLayer.image(streetlight, streetPosX, streetPosY, streetSizeX, streetSizeY);
  //cloud
  staticLayer.image(cloud, cloudPosX, cloudPosY, cloudSizeX, cloudSizeY);
  //shelf
  staticLayer.image(shelf, shelfPosX, shelfPosY, shelfSizeX, shelfSizeY);
}

export function fixImagePositions(staticLayer, size) {
  let cloudTop = cloudPosY + cloudSizeY * 0.29;
  let cloud2Top = cloudPosY + cloudSizeY * 0.41;
  let cloud3Top = cloudPosY + cloudSizeY * 0.57;
  let cloudLeft = cloudPosX + cloudSizeX * 0.17;
  let cloudRight = cloudPosX + cloudSizeX * 0.62;
  let catLoc = [
    [staticLayer.width * 0.75, cloudTop],
    [cloudLeft, cloud2Top],
    [cloudRight, cloud2Top],
    [cloudLeft, cloud3Top],
    [cloudRight, cloud3Top],
    [staticLayer.width * 0.725, cloud3Top],
    [staticLayer.width * 0.13, staticLayer.height - size * 0.46],
    [staticLayer.width * 0.34, staticLayer.height - size * 0.46],
    [staticLayer.width * 0.51, staticLayer.height - size * 0.46],
    [staticLayer.width * 0.66, staticLayer.height - size * 0.46],
    [staticLayer.width * 0.8, staticLayer.height - size * 0.46],
    [staticLayer.width * 0.92, staticLayer.height - size * 0.46],
  ];

  startPos = staticLayer.width * 0.015;
  xInc = staticLayer.width * 0.045;
  yLevel = staticLayer.height;
  let teaLoc = [
    [startPos, staticLayer.height * 0.18],
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
    [staticLayer.width * 0.25, yLevel * 0.17],
    [shelfPosX + shelfSizeX * 0.52, overShelfY],
    [staticLayer.width * 0.57, staticLayer.height * 0.62],
    [shelfPosX + shelfSizeX * 0.6, cloudPosY + cloudSizeY * 0.3],
    [staticLayer.width * 0.8, yLevel * 0.13],
    [staticLayer.width * 0.58, yLevel * 0.08],
    [leftShelf, overShelfY],
    [leftShelf, overShelfY],
    [staticLayer.width * 0.3, yLevel * 0.25],
  ];

  let particleLoc = [streetPosX + streetSizeX * 0.5, streetPosY - streetSizeY * 0.02];

  let weatherLoc = [
    [shelfPosX + shelfSizeX * 0.45, shelfPosY + shelfSizeY * -0.325],
    [xtraCnvs.width * 0.75, cloud3Top],
    [rainCloudSizeX, rainCloudSizeY],
  ];

  let result = [catLoc, teaLoc, diyLoc, xtraLoc, particleLoc, weatherLoc];
  return result;
}
