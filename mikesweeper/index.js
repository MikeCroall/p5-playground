var grid;
var gridWidth = 30,
    gridHeight = 20;
var squareWidth = 10,
    squareHeight = 10;
var gameOver;
var firstClick = true;

const numberColours = [{
        r: 0,
        g: 0,
        b: 0
    }, // 0 - default case (shouldn't actually be called, just in case)
    {
        r: 0,
        g: 204,
        b: 0
    }, // 1 - green
    {
        r: 0,
        g: 204,
        b: 255
    }, // 2 - blue
    {
        r: 153,
        g: 102,
        b: 255
    }, // 3 - purple
    {
        r: 0,
        g: 0,
        b: 255
    }, // 4 - blue
    {
        r: 0,
        g: 0,
        b: 0
    }, // 5 - black
    {
        r: 0,
        g: 153,
        b: 153
    }, // 6 - teal?
    {
        r: 255,
        g: 102,
        b: 0
    }, // 7 - orange
    {
        r: 255,
        g: 0,
        b: 0
    } // 8 - red
];

// Disable right click
window.oncontextmenu = function() {
    return false
};

function drawEmpty(x, y, squareWidth, squareHeight) {
    fill(255);
    stroke(0);
    strokeWeight(2);
    rect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
}

function drawCovered(x, y, squareWidth, squareHeight) {
    fill(200);
    stroke(0);
    strokeWeight(2);
    rect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
}

function drawMine(x, y, squareWidth, squareHeight) {
    fill(0);
    noStroke();
    ellipse((x + 0.5) * squareWidth, (y + 0.5) * squareHeight, 0.6 * squareWidth, 0.6 * squareHeight);
    quad((x + 0.1) * squareWidth, (y + 0.2) * squareHeight, (x + 0.2) * squareWidth, (y + 0.1) * squareHeight, (x + 0.9) * squareWidth, (y + 0.8) * squareHeight, (x + 0.8) * squareWidth, (y + 0.9) * squareHeight);
    quad((x + 0.9) * squareWidth, (y + 0.2) * squareHeight, (x + 0.8) * squareWidth, (y + 0.1) * squareHeight, (x + 0.1) * squareWidth, (y + 0.8) * squareHeight, (x + 0.2) * squareWidth, (y + 0.9) * squareHeight);
    quad((x + 0.42) * squareWidth, (y + 0.1) * squareHeight, (x + 0.58) * squareWidth, (y + 0.1) * squareHeight, (x + 0.58) * squareWidth, (y + 0.9) * squareHeight, (x + 0.42) * squareWidth, (y + 0.9) * squareHeight);
    quad((x + 0.1) * squareWidth, (y + 0.42) * squareHeight, (x + 0.9) * squareWidth, (y + 0.42) * squareHeight, (x + 0.9) * squareWidth, (y + 0.58) * squareHeight, (x + 0.1) * squareWidth, (y + 0.58) * squareHeight);
}

function drawMineCount(x, y, squareWidth, squareHeight, count) {
    textSize(squareHeight);
    fill(numberColours[count].r, numberColours[count].g, numberColours[count].b);
    noStroke();
    textAlign(CENTER, CENTER);
    text(count, (x + 0.5) * squareWidth, (y + 0.5) * squareHeight);
}

function drawFlag(x, y, squareWidth, squareHeight) {
    fill(51);
    noStroke();
    rect((x + 0.3) * squareWidth, (y + 0.1) * squareHeight, 0.1 * squareWidth, 0.8 * squareHeight);
    triangle((x + 0.4) * squareWidth, (y + 0.1) * squareHeight, (x + 0.4) * squareWidth, (y + 0.6) * squareHeight, (x + 0.8) * squareWidth, (y + 0.35) * squareHeight);
}

function validPosition(x, y) {
    return x >= 0 && y >= 0 && x < gridWidth && y < gridHeight;
}

function surrounding8(x, y) {
    var points = surrounding4(x, y);
    if (validPosition(x + 1, y + 1)) {
        points.push({
            x: x + 1,
            y: y + 1
        });
    }
    if (validPosition(x - 1, y - 1)) {
        points.push({
            x: x - 1,
            y: y - 1
        });
    }
    if (validPosition(x + 1, y - 1)) {
        points.push({
            x: x + 1,
            y: y - 1
        });
    }
    if (validPosition(x - 1, y + 1)) {
        points.push({
            x: x - 1,
            y: y + 1
        });
    }
    return points;
}

function surrounding4(x, y) {
    var points = [];
    if (validPosition(x - 1, y)) {
        points.push({
            x: x - 1,
            y: y
        });
    }
    if (validPosition(x + 1, y)) {
        points.push({
            x: x + 1,
            y: y
        });
    }
    if (validPosition(x, y - 1)) {
        points.push({
            x: x,
            y: y - 1
        });
    }
    if (validPosition(x, y + 1)) {
        points.push({
            x: x,
            y: y + 1
        });
    }
    return points;
}

function calculateAdjacentMines(x, y, grid) {
    var surrounding = surrounding8(x, y);
    var mineCount = 0;
    for (var i = 0; i < surrounding.length; i++) {
        if (grid[surrounding[i].y][surrounding[i].x].mine) {
            mineCount++;
        }
    }
    return mineCount;
}

function getNewGrid(gridWidth, gridHeight) {
    var grid = [];

    // Generate mines
    for (var y = 0; y < gridHeight; y++) {
        var row = [];
        for (var x = 0; x < gridWidth; x++) {
            var mine = random() <= 0.15625; // 0.15625 is the density of mines in microsoft minesweeper's default game sizes
            row.push({
                mine, // by only giving mine, it is the equivalent of mine: mine, taking both the variable name and value into the object
                reveal: false
            });
        }
        grid.push(row);
    }

    // Generate adjacent mines counts
    for (var y = 0; y < gridHeight; y++) {
        for (var x = 0; x < gridWidth; x++) {
            grid[y][x].adjacentMines = calculateAdjacentMines(x, y, grid);
        }
    }

    return grid;
}

function expandOpenArea(x, y) {
    var toOpen = surrounding8(x, y);
    while (toOpen.length > 0) {
        var point = toOpen[0];
        toOpen.splice(0, 1);
        if (!grid[point.y][point.x].flag && !grid[point.y][point.x].reveal && !grid[point.y][point.x].adjacentMines) {
            toOpen.push.apply(toOpen, surrounding8(point.x, point.y));
        }
        if (!grid[point.y][point.x].flag) {
            grid[point.y][point.x].reveal = true;
        }
    }
}

function surroundingCorrectlyFlagged(x, y) {
    var points = surrounding8(x, y);
    for (var i = 0; i < points.length; i++) {
        // The below looks messy because some grid squares are not storing the property at all, can't do basic equality check
        if (!(
                (grid[points[i].y][points[i].x].flag && grid[points[i].y][points[i].x].mine) ||
                (!grid[points[i].y][points[i].x].flag && !grid[points[i].y][points[i].x].mine)
            )) {
            return false;
        }
    }
    return true;
}

function allMinesFlaggedNoExtras() {
    for (var y = 0; y < gridHeight; y++) {
        for (var x = 0; x < gridWidth; x++) {
            if (!(
                    (grid[y][x].flag && grid[y][x].mine) ||
                    (!grid[y][x].flag && !grid[y][x].mine)
                )) {
                return false;
            }
        }
    }
    return true;
}

function setup() {
    frameRate(25);
    createCanvas(windowWidth * 8 / 10, windowHeight * 9 / 10);
    squareWidth = width / gridWidth;
    squareHeight = height / gridHeight;

    grid = getNewGrid(gridWidth, gridHeight);
}

function windowResized() {
    resizeCanvas(windowWidth * 8 / 10, windowHeight * 9 / 10);
    squareWidth = width / gridWidth;
    squareHeight = height / gridHeight;
}

function mousePressed() {
    if (!gameOver) {
        const x = floor(mouseX / squareWidth);
        const y = floor(mouseY / squareHeight);

        if (validPosition(x, y)) {
            if (firstClick) {
                firstClick = false;
                // TODO  ensure first click of game is NOT a mine (move it away and recalculate if needed) (not necessarily needed, but would be nice)
            }

            if (mouseButton === "left") {
                if (!grid[y][x].flag) {
                    var previouslyClosed = !grid[y][x].reveal;
                    grid[y][x].reveal = true;
                    if (grid[y][x].mine) {
                        for (var ys = 0; ys < gridHeight; ys++) {
                            for (var xs = 0; xs < gridWidth; xs++) {
                                if (grid[ys][xs].mine) {
                                    grid[ys][xs].reveal = true;
                                }
                            }
                        }
                        gameOver = true;
                        noLoop();
                        alert("You lost!");
                    } else if (previouslyClosed && !grid[y][x].adjacentMines) {
                        expandOpenArea(x, y);
                    } else if (!previouslyClosed && grid[y][x].adjacentMines) {
                        if (surroundingCorrectlyFlagged(x, y)) {
                            expandOpenArea(x, y);
                        }
                    }
                }
            } else if (mouseButton === "right") {
                if (!grid[y][x].reveal) {
                    grid[y][x].flag = grid[y][x].flag ? false : true; // Handles initially 'undefined' flag, avoids saving unneeded bools from initialisation
                    if (allMinesFlaggedNoExtras()) {
                        noLoop();
                        alert("You win!");
                    }
                }
            }

            // Prevent default as we have handled it (context menu had to be disabled separately from this)
            return false;
        }
    }
}

function draw() {
    background(255);

    for (var y = 0; y < gridHeight; y++) {
        for (var x = 0; x < gridWidth; x++) {
            if (grid[y][x].reveal) {
                drawEmpty(x, y, squareWidth, squareHeight);
                if (grid[y][x].mine) {
                    drawMine(x, y, squareWidth, squareHeight);
                } else if (grid[y][x].adjacentMines) {
                    drawMineCount(x, y, squareWidth, squareHeight, grid[y][x].adjacentMines);
                }
            } else {
                drawCovered(x, y, squareWidth, squareHeight);
                if (grid[y][x].flag) {
                    drawFlag(x, y, squareWidth, squareHeight);
                }
            }
        }
    }
}
