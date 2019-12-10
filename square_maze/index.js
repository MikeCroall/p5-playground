var maze = [];
var path = [];
var mazeWidth;
var mazeHeight;
var desiredWallCount;
let start;
let end;
var walls = 0;

var updateInfo = {
    stage: 0, // 0 - generation, 1 - solving, 2 - resolving path, 3 - done
}

let drawDebugText = false;

function setup() {
    createCanvas(windowWidth * 9 / 10, windowHeight * 9 / 10);

    mazeWidth = floor(width / 30);
    mazeHeight = floor(height / 30);
    desiredWallCount = 0.3 * mazeWidth * mazeHeight;

    for (var y = 0; y < mazeHeight; y++) {
        var row = [];
        for (var x = 0; x < mazeWidth; x++) {
            row.push({
                wall: false,
                g: Infinity,
                f: Infinity
            });
        }
        maze.push(row);
    }

    start = createVector(0, 0);
    end = createVector(mazeWidth - 1, mazeHeight - 1);
    maze[start.y][start.x].g = 0;
    maze[start.y][start.x].f = maze[start.y][start.x].g + h(start);
    maze[start.y][start.x].cameFrom = false;
}

function draw() {
    update();

    colorMode(RGB, 255);
    background(51);
    var squareWidth = width / mazeWidth;
    var squareHeight = height / mazeHeight;

    for (var y = 0; y < mazeHeight; y++) {
        for (var x = 0; x < mazeWidth; x++) {
            if (updateInfo.currentPosition && updateInfo.currentPosition.x === x && updateInfo.currentPosition.y === y) {
                fill(255, 255, 0);
            } else if (maze[y][x].inClosed) {
                fill(190, 0, 0);
            } else if (maze[y][x].inOpen) {
                fill(255, 255, 0);
            } else if (maze[y][x].wall) {
                fill(0);
            } else {
                fill(140);
            }
            noStroke();
            rect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);

            if (drawDebugText) {
                fill(0);
                textSize(10);
                textAlign(LEFT, TOP);
                text("g:" + maze[y][x].g, x * squareWidth, y * squareHeight);
                text("h:" + h({x,y}), x * squareWidth, y * squareHeight + 15);
                text("f:" + maze[y][x].f, x * squareWidth, y * squareHeight + 30);
                text(maze[y][x].inOpen ? "open" : maze[y][x].inClosed ? "closed" : "", x * squareWidth, y * squareHeight + 45)
            }
        }
    }

    noStroke();
    fill(0, 255, 0);
    rect(start.x * squareWidth, start.y * squareHeight, squareWidth, squareHeight);
    fill(255, 0, 0);
    rect(end.x * squareWidth, end.y * squareHeight, squareWidth, squareHeight);

    colorMode(HSB, 360);
    strokeWeight(4);
    for (var i = 0; i < path.length - 1; i++) {
        stroke(map(i, 0, path.length - 1, 0, 120), 360, 360);
        var a = path[i];
        var b = path[i + 1];
        line((a.x + 0.5) * squareWidth, (a.y + 0.5) * squareHeight, (b.x + 0.5) * squareWidth, (b.y + 0.5) * squareHeight);
    }

}

function windowResized() {
    resizeCanvas(windowWidth * 9 / 10, windowHeight * 9 / 10);
}

function validPosition(x, y) {
    return x >= 0 && y >= 0 && x < mazeWidth && y < mazeHeight;
}

function surrounding4(x, y) {
    var points = [];
    if (validPosition(x - 1, y)) {
        points.push(createVector(x - 1, y));
    }
    if (validPosition(x + 1, y)) {
        points.push(createVector(x + 1, y));
    }
    if (validPosition(x, y - 1)) {
        points.push(createVector(x, y - 1));
    }
    if (validPosition(x, y + 1)) {
        points.push(createVector(x, y + 1));
    }
    return points;
}

function h(point) {
    // return dist(point.x, point.y, end.x, end.y); // This is better for if we allow diagonal movement
    return abs(point.x - end.x) + abs(point.y - end.y);
}

function indexOfLowestFScore(array) {
    var ind = -1;
    var lowestF = Infinity;
    for (var i = 0; i < array.length; i++) {
        if (maze[array[i].y][array[i].x].f < lowestF) {
            ind = i;
            lowestF = maze[array[i].y][array[i].x].f;
        }
    }
    return ind;
}

function update() {
    if (updateInfo.stage === 0) {
        // GENERATE
        if (updateInfo.doneGen) {
            // Maze complete - drop irrelevant parts of updateInfo, give parts for solving
            updateInfo = {
                stage: 1,
                open: [start]
            }
        } else {
            // Update step for generate
            if (walls < desiredWallCount) {
                var x = floor(random(mazeWidth));
                var y = floor(random(mazeHeight));
                while (maze[y][x].wall ||
                    dist(start.x, start.y, x, y) < 4 ||
                    dist(end.x, end.y, x, y) < 4) {
                    x = floor(random(mazeWidth));
                    y = floor(random(mazeHeight));
                }
                maze[y][x].wall = true;
                walls++;
            } else {
                updateInfo.doneGen = true;
            }
        }
    } else if (updateInfo.stage === 1) {
        // SOLVE
        if (updateInfo.open.length) {
            var lowestFIndex = indexOfLowestFScore(updateInfo.open);
            var point = updateInfo.open[lowestFIndex].copy();

            if (point.x === end.x && point.y === end.y) {
                updateInfo = {
                    stage: 2,
                    clearedOpenClosedStatuses: false
                }
            } else {
                updateInfo.open.splice(lowestFIndex, 1);
                maze[point.y][point.x].inOpen = false;
                maze[point.y][point.x].inClosed = true;

                var newOpens = surrounding4(point.x, point.y)
                    .filter(function(p) {
                        if (maze[p.y][p.x].wall) {
                            return false;
                        }
                        return !maze[p.y][p.x].inClosed;
                    });
                for (var i = 0; i < newOpens.length; i++) {
                    var tentativeG = maze[point.y][point.x].g + 1;

                    if (tentativeG < maze[newOpens[i].y][newOpens[i].x].g) {
                        maze[newOpens[i].y][newOpens[i].x].cameFrom = point;
                        maze[newOpens[i].y][newOpens[i].x].g = tentativeG;
                        maze[newOpens[i].y][newOpens[i].x].f = tentativeG + h(newOpens[i]);
                        if (!maze[newOpens[i].y][newOpens[i].x].inOpen) {
                            updateInfo.open.push(newOpens[i]);
                            maze[newOpens[i].y][newOpens[i].x].inOpen = true;
                        }
                    }
                }
            }
        } else {
            // Open set empty
            updateInfo = {
                stage: 3,
                showAlert: true
            }
        }
    } else if (updateInfo.stage === 2) {
        // Maze solved, end found
        if (!updateInfo.clearedOpenClosedStatuses) {
            for (var y = 0; y < mazeHeight; y++) {
                for (var x = 0; x < mazeWidth; x++) {
                    maze[y][x].inClosed = false;
                    maze[y][x].inOpen = false;
                }
            }
            updateInfo.clearedOpenClosedStatuses = true;
        }
        if (path.length === 0) {
            path = [end];
        } else {
            var lastElem = path[path.length - 1];
            if (maze[lastElem.y][lastElem.x].cameFrom) {
                path.push(maze[lastElem.y][lastElem.x].cameFrom);
            } else {
                // No more updates needed
                updateInfo = {
                    stage: 3
                }
            }
        }
    } else if (updateInfo.stage === 3) {
        if (updateInfo.showAlert) {
            alert("No path was found through the maze!");
            updateInfo.showAlert = false;
        }
        noLoop();
    }
}
