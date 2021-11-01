let framesPerStep = 30;

let gameWidth = 50;
let gameHeight = 25;
let cellWidth;
let cellHeight;

let grid = [];
let gridNext = [];

let paused = true;
let aliveCount = 0;
let lblAlive;

function getSurroundingLiveCount(y, x) {
    let count = 0;
    for (let i = -1; i <= 1 ; i++) {
        for (let j = -1; j <= 1 ; j++) {
            if (i === 0 && j === 0) { continue; }
            let checkX = x + i;
            let checkY = y + j;
            if (checkX >= 0 && checkX < gameWidth && checkY >= 0 && checkY < gameHeight) {
                count += grid[checkY][checkX];
            }
        }
    }
    return count;
}

function doStep() {
    aliveCount = 0;
    gridNext = [...grid].map(row => [...row]);
    for (let y = 0; y < gameHeight; y++) {
        for (let x = 0; x < gameWidth; x++) {
            let surroundLiveCount =  getSurroundingLiveCount(y, x);
            if (
                (surroundLiveCount >= 2 && surroundLiveCount <= 3 && grid[y][x] === 1) ||
                (surroundLiveCount === 3 && grid[y][x] === 0)
            ) {
                gridNext[y][x] = 1;
                aliveCount += 1;
            } else {
                gridNext[y][x] = 0;
            }
        }
    }
    grid = gridNext;
    lblAlive.html("Alive: " + aliveCount);
}

function mousePressed() {
    let x = floor(mouseX / cellWidth);
    let y = floor(mouseY / cellHeight);
    if (x >= 0 && x < gameWidth && y >= 0 && y < gameHeight) {
        if (grid[y][x] === 0) {
            grid[y][x] = 1;
            aliveCount += 1;
        } else {
            grid[y][x] = 0;
            aliveCount -= 1;
        }
        lblAlive.html("Alive: " + aliveCount);
    }
}

function windowResized() {
    resizeCanvas(windowWidth*0.95, windowHeight);
    cellWidth = width / gameWidth;
    cellHeight = height / gameHeight;
}

function setup() {
    createCanvas(windowWidth*0.95, windowHeight);
    cellWidth = width / gameWidth;
    cellHeight = height / gameHeight;
    generateControlsGui();
    frameRate(framesPerStep * 2);
    pixelDensity(1);

    for (let y = 0; y < gameHeight; y++) {
        let row = [];
        for (let x = 0; x < gameWidth; x++) {
            row.push(0);
        }
        grid.push(row);
    }

    gridNext = [...grid].map(row => [...row]);
}

function draw() {
    background(51);

    if (!paused && frameCount % framesPerStep === 0) {
        doStep();
    }

    stroke(51);
    strokeWeight(1);
    for (let y = 0; y < gameHeight; y++) {
        for (let x = 0; x < gameWidth; x++) {
            fill(grid[y][x] === 0 ? 0 : 255);
            rect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        }
    }
}

function generateControlsGui() {
    let divButtons = createDiv("Controls");
    divButtons.position(0, 0);
    divButtons.id("divButtons");
    divButtons.style("color", "#fff");

    let btnPlayPause = createButton("Play");
    btnPlayPause.parent("divButtons");
    btnPlayPause.style("display", "block");
    btnPlayPause.mousePressed(function() {
        paused = !paused;
        btnPlayPause.html(paused ? "Play" : "Pause");
    });

    let btnStep = createButton("Step");
    btnStep.parent("divButtons");
    btnStep.style("display", "block");
    btnStep.mousePressed(function() {
        doStep();
    });

    lblAlive = createElement("span");
    lblAlive.parent("divButtons");
    lblAlive.style("display", "block");
    lblAlive.html("Alive: 0");
}
