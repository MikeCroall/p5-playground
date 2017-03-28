var maze = [];

var mazeWidth = 8,
    mazeHeight = 8;

var updateInfo = {
    stage: 0, // 0 - generation, 1 - solving
    currentPosition: {
        x: 0,
        y: 0
    },
    pastPositions: []
}

function setup() {
    // frameRate(20);
    createCanvas(windowWidth * 9 / 10, windowHeight * 9 / 10);

    for (var y = 0; y < mazeHeight; y++) {
        var row = [];
        for (var x = 0; x < mazeWidth; x++) {
            row.push({
                x: x,
                y: y,
                start: false,
                end: false,
                wallUp: true,
                wallLeft: true,
                wallDown: true,
                wallRight: true,
                genVisited: false
            });
        }
        maze.push(row);
    }

    maze[0][0].start = true;
    maze[0][0].genVisited = true;
    maze[mazeHeight - 1][mazeWidth - 1].end = true;

    draw();
}

function draw() {
    update();

    background(51);
    var squareWidth = width / mazeWidth;
    var squareHeight = height / mazeHeight;

    for (var y = 0; y < mazeHeight; y++) {
        for (var x = 0; x < mazeWidth; x++) {
            if (maze[y][x].start) {
                fill(0, 255, 0);
            } else if (maze[y][x].end) {
                fill(255, 0, 0);
            } else if (updateInfo.currentPosition && updateInfo.currentPosition.x === x && updateInfo.currentPosition.y === y) {
                fill(255, 255, 0);
            } else if (maze[y][x].genVisited) {
                fill(200);
            } else {
                fill(255);
            }
            noStroke();
            rect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);

            stroke(0);
            strokeWeight(1);
            if (maze[y][x].wallUp) {
                line(x * squareWidth, y * squareHeight, (x + 1) * squareWidth, y * squareHeight);
            }
            if (maze[y][x].wallLeft) {
                line(x * squareWidth, y * squareHeight, x * squareWidth, (y + 1) * squareHeight);
            }
            if (maze[y][x].wallDown) {
                line(x * squareWidth, (y + 1) * squareHeight, (x + 1) * squareWidth, (y + 1) * squareHeight);
            }
            if (maze[y][x].wallRight) {
                line((x + 1) * squareWidth, y * squareHeight, (x + 1) * squareWidth, (y + 1) * squareHeight);
            }
        }
    }
}

function validPosition(x, y) {
    return x >= 0 && y >= 0 && x < mazeWidth && y < mazeHeight;
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

function update() {
    if (updateInfo.stage === 0) {
        // GENERATE
        if (!updateInfo.currentPosition) {
            // Maze complete - drop irrelevant parts of updateInfo, give parts for solving
            updateInfo = {
                stage: 1,
                open: [{
                    x: 0,
                    y: 0
                }],
                closed: []
            }
        } else {
            // Update step for generate
            var possibleMoves = surrounding4(updateInfo.currentPosition.x, updateInfo.currentPosition.y);
            possibleMoves = possibleMoves.filter(function(move) {
                return !maze[move.y][move.x].genVisited;
            });
            if (possibleMoves.length) {
                var move = random(possibleMoves);
                if (updateInfo.currentPosition.x < move.x) {
                    // Go right
                    maze[updateInfo.currentPosition.y][updateInfo.currentPosition.x].wallRight = false;
                    maze[move.y][move.x].wallLeft = false;
                } else if (updateInfo.currentPosition.x > move.x) {
                    // Go left
                    maze[updateInfo.currentPosition.y][updateInfo.currentPosition.x].wallLeft = false;
                    maze[move.y][move.x].wallRight = false;
                } else if (updateInfo.currentPosition.y < move.y) {
                    // Go down
                    maze[updateInfo.currentPosition.y][updateInfo.currentPosition.x].wallDown = false;
                    maze[move.y][move.x].wallUp = false;
                } else {
                    // Go up
                    maze[updateInfo.currentPosition.y][updateInfo.currentPosition.x].wallUp = false;
                    maze[move.y][move.x].wallDown = false;
                }
                updateInfo.pastPositions.push(updateInfo.currentPosition);
                updateInfo.currentPosition = move;
                maze[move.y][move.x].genVisited = true;
            } else {
                updateInfo.currentPosition = updateInfo.pastPositions[updateInfo.pastPositions.length - 1];
                updateInfo.pastPositions.splice(updateInfo.pastPositions.length - 1, 1);
            }
        }
    } else if (updateInfo.stage === 1) {
        // SOLVE
        frameRate(1);
    }
}
