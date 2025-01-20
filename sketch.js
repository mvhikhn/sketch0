const COLORS = {
  background: "#1d1d1b",
  border: "#f2f2e7",
  palette: ["#4793AF", "#FFC470", "#DD5746", "#8B322C"]
};

const SETTINGS = {
  animationSpeed: 0.03,
  maxDepth: 2,
  minModuleSize: 40,
  subdivideChance: 0.4,
  crossSize: 0.7
};

let grid = {
  columns: 0,
  rows: 0,
  moduleSize: 0,
  seed: 0,
  depth: 0
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeJoin(ROUND);

  // Random grid setup
  grid.columns = floor(random(5, 8));
  grid.moduleSize = width / grid.columns;
  grid.rows = ceil(height / grid.moduleSize);
  grid.seed = random(1000);

  stroke(COLORS.border);
  strokeWeight(2);
  frameRate(60);
}

function draw() {
  background(COLORS.background);
  randomSeed(grid.seed);

  const movement = (sin(frameCount * SETTINGS.animationSpeed) + 1) / 2;
  grid.depth = 0;

  drawGrid(0, 0, grid.columns, grid.rows, width, movement);
}

function drawGrid(x, y, cols, rows, size, movement) {
  const cellSize = size / cols;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const posX = x + col * cellSize;
      const posY = y + row * cellSize;

      drawCell(posX, posY, cellSize, movement);
    }
  }
}

function drawCell(x, y, size, movement) {
  const colorIndex = floor(random(COLORS.palette.length));

  fill(COLORS.palette[colorIndex]);
  rect(x, y, size, size);

  if (shouldSubdivide(size)) {
    grid.depth++;
    drawGrid(x, y, 2, 2, size, movement);
    grid.depth--;
    return;
  }

  fill(COLORS.palette[(colorIndex + 1) % COLORS.palette.length]);
  const shapeType = floor(random(4));
  drawShape(shapeType, x, y, size, movement);
}

function shouldSubdivide(size) {
  return random() < SETTINGS.subdivideChance && 
         grid.depth < SETTINGS.maxDepth && 
         size > SETTINGS.minModuleSize;
}

function drawShape(type, x, y, size, movement) {
  const center = { x: x + size / 2, y: y + size / 2 };

  switch(type) {
    case 0:
      drawSpinningCross(center, size, movement);
      break;
    case 1:
      const maxRadius = size / 2 * 0.9;
      circle(center.x, center.y, maxRadius * 2 * movement);
      break;
    case 2:
      drawCrown(x, y, size, movement);
      break;
    case 3:
      drawDiamond(x, y, size, movement);
      break;
  }
}

function drawSpinningCross(center, size, phase) {
  const rotation = phase * TWO_PI;
  const armLength = size * SETTINGS.crossSize / 2;
  const padding = size * 0.1;

  push();
  translate(center.x, center.y);
  rotate(rotation);

  const safeLength = min(armLength, (size/2 - padding));
  rectMode(CENTER);
  rect(0, 0, safeLength * 2, safeLength * 0.2);
  rect(0, 0, safeLength * 0.2, safeLength * 2);

  pop();
}

function drawCrown(x, y, size, height) {
  const points = 5;
  const spacing = size / (points - 1);
  const peakHeight = size * height * 0.4;

  beginShape();
  for (let i = 0; i < points; i++) {
    vertex(x + i * spacing, y + (i % 2 ? peakHeight : 0));
  }
  for (let i = points - 1; i >= 0; i--) {
    vertex(x + i * spacing, y + size - (i % 2 ? peakHeight : 0));
  }
  endShape(CLOSE);
}

function drawDiamond(x, y, size, scale) {
  const center = size / 2;
  const maxOffset = center * 0.9;
  const offset = maxOffset * scale;

  beginShape();
  vertex(x + center, y + offset);
  vertex(x + size - offset, y + center);
  vertex(x + center, y + size - offset);
  vertex(x + offset, y + center);
  endShape(CLOSE);
}
