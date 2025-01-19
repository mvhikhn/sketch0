
let backgroundColor = "#1d1d1b";
let borderColor = "#f2f2e7";
let colorPalette = [
  "#c38f6d",
  "#ea7f4a",
  "#bf9d63",
  "#7a5c3d",
  "#f2e0a9",
  "#af7a5d"
];

let sineScale = 0.01;

let columns;
let rows;

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeJoin(ROUND);
  
  columns = floor(random(3, 7));
  let moduleSize = width / columns;
  rows = ceil(height / moduleSize);
  
  seed = random(1000);
}

function draw() {
  background(220);
  randomSeed(seed);
  drawGrid(0, 0, columns, rows, width);
}

function drawGrid(xStart, yStart, colCount, rowCount, totalWidth) {
  
  stroke(borderColor);
  strokeWeight(2);
  
  let moduleSize = totalWidth / colCount;
  let differentialMovement = 0;
  for (let j = 0; j < rowCount; j++) {
    for (let i = 0; i < colCount; i++) {
      
      let x = xStart + i * moduleSize;
      let y = yStart + j * moduleSize;
      
      let colorIndex = floor(random(colorPalette.length - 1));
      fill(colorPalette[colorIndex]);
      rect(x, y, moduleSize, moduleSize);
      fill(colorPalette[(colorIndex + 1) % colorPalette.length]);
      
      let movement = map(sin(frameCount * sineScale + differentialMovement), -1, 1, 0, 1);
      
      let selector = floor(random(6 + 3));
      
      if (selector === 0) {
        let outerRadius = moduleSize / 2 - 5;
        let innerRadius = outerRadius * movement;
        let pointsCount = [4, 6, 8, 10, 12, 14, 16, 18][floor(random() * 8)];
        drawStar(x + moduleSize / 2, y + moduleSize / 2, innerRadius, outerRadius, pointsCount, 0);
      }
      
      if (selector === 1) {
        let diameter = random(moduleSize / 2, moduleSize) * movement;
        circle(x + moduleSize / 2, y + moduleSize / 2, diameter);
      }
      
      if (selector === 2) {
        let points = [3, 5, 7, 9, 11, 13][floor(random(6))];
        let pointsHeight = map(movement, 0, 1, 0.2, 0.8);
        drawDoubleCrown(x, y, moduleSize, moduleSize, points, pointsHeight);
      }
      
      if (selector === 3) {
        let shaftWidth = map(movement, 0, 1, 0.2, 0.8);
        drawAxe(x, y, moduleSize, moduleSize, shaftWidth);
      }
      
      if (selector === 4) {
        let openingWidth = random(0.4, 1) * movement;
        drawRhombus(x, y, moduleSize, moduleSize, openingWidth);
      }
      if (selector >= 5 && moduleSize > 60) {
        drawGrid(x, y, 2, 2, moduleSize);
      }
      differentialMovement += 1;
    }
  }
}

function drawStar(x, y, innerRadius, outerRadius, pointsCount, startAngle) {
  let step = TWO_PI / pointsCount;
  beginShape();
  for (let i = 0; i < pointsCount; i++) {
    let angle = startAngle + step * i;
    let innerX = x + cos(angle) * innerRadius;
    let innerY = y + sin(angle) * innerRadius;
    vertex(innerX, innerY);
    let outerX = x + cos(angle + step / 2.0) * outerRadius;
    let outerY = y + sin(angle + step / 2.0) * outerRadius;
    vertex(outerX, outerY);
  }
  endShape(CLOSE);
}

function drawDoubleCrown(x, y, width, height, pointsCount, relativeHeight) {
  let pointsHeight = height * relativeHeight / 2;
  let pointSpacing = width / (pointsCount - 1);
  beginShape();
  for (let i = 0; i < pointsCount; i++) {
    let pointX = x + i * pointSpacing;
    let pointY = y;
    if (i % 2 !== 0) {
      pointY = y + pointsHeight;
    }
    vertex(pointX, pointY);
  }
  for (let i = 0; i < pointsCount; i++) {
    let pointX = (x + width) - (i * pointSpacing);
    let pointY = y + height;
    if (i % 2 !== 0) {
      pointY = (y + height) - pointsHeight;
    }
    vertex(pointX, pointY);
  }
  endShape(CLOSE);
}

function drawAxe(x, y, width, height, shaftWidthRelative) {
  let shaftWidth = width * shaftWidthRelative / 2;
  beginShape();
  vertex(x, y);
  vertex(x + shaftWidth, y + shaftWidth);
  vertex(x + shaftWidth, y);
  vertex(x + (width - shaftWidth), y);
  vertex(x + (width - shaftWidth), y + shaftWidth);
  vertex(x + width, y);
  vertex(x + width, y + height);
  vertex(x + (width - shaftWidth), y + (height - shaftWidth));
  vertex(x + (width - shaftWidth), y + height);
  vertex(x + shaftWidth, y + height);
  vertex(x + shaftWidth, y + (height - shaftWidth));
  vertex(x, y + height);
  endShape(CLOSE);
}

function drawRhombus(x, y, width, height, openingRelative) {
  let openingWidth = width * openingRelative / 2;
  beginShape();
  vertex(x + openingWidth, y + height / 2);
  vertex(x + width / 2, y);
  vertex(x + (width - openingWidth), y + height / 2);
  vertex(x + width / 2, y + height);
  endShape(CLOSE);
}