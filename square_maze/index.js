var maze = [];
var path = [];

var mazeWidth = 30,
    mazeHeight = 20;

var wantWalls = 2 * 0.15625 * mazeWidth * mazeHeight;
var walls = 0;

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
                wall: false,
                genVisited: false
            });
        }
        maze.push(row);
    }

    maze[0][0].start = true;
    maze[0][0].genVisited = true;
    maze[0][0].g = 0;
    maze[0][0].h = sqrt(pow(mazeWidth, 2) + pow(mazeHeight, 2));
    maze[0][0].f = maze[0][0].g + maze[0][0].h;
    maze[0][0].cameFrom = false;
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
            } else if (maze[y][x].inClosed) {
                fill(127, 0, 0);
            } else if (maze[y][x].inOpen) {
                fill(255, 255, 0);
            } else if (maze[y][x].genVisited && updateInfo.stage < 3) {
                fill(200);
            } else if (maze[y][x].wall) {
                fill(0);
            } else {
                fill(255);
            }
            noStroke();
            rect(x * squareWidth, y * squareHeight, squareWidth, squareHeight);
        }
    }

    stroke(197, 66, 244);
    strokeWeight(3);
    for (var i = 0; i < path.length - 1; i++) {
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

function h(point) {
    return sqrt(pow(point.x - mazeWidth, 2), pow(point.y - mazeHeight, 2));
}

function indexOfLowestFScore(array) {
    var ind = 0,
        lowestF = maze[array[0].y][array[0].x].f;
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
                open: [{
                    x: 0,
                    y: 0
                }],
                closed: []
            }
        } else {
            // Update step for generate
            if (walls < wantWalls) {
                var x = floor(random(mazeWidth));
                var y = floor(random(mazeHeight));
                while (maze[y][x].wall) {
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
            var ind = indexOfLowestFScore(updateInfo.open);
            var point = JSON.parse(JSON.stringify(updateInfo.open[ind]));

            if (point.x === mazeWidth - 1 && point.y === mazeHeight - 1) {
                updateInfo = {
                    stage: 2,
                    clearedOpenClosedStatuses: false
                }
            } else {
                updateInfo.open.splice(ind, 1);
                maze[point.y][point.x].inOpen = false;
                updateInfo.closed.push(point);
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

                    var contin = true;
                    if (!maze[newOpens[i].y][newOpens[i].x].inOpen) {
                        updateInfo.open.push(newOpens[i]);
                        maze[newOpens[i].y][newOpens[i].x].inOpen = true;
                    } else if (tentativeG >= maze[newOpens[i].y][newOpens[i].x].g) {
                        contin = false;
                    }
                    if (contin) {
                        maze[newOpens[i].y][newOpens[i].x].cameFrom = point;
                        maze[newOpens[i].y][newOpens[i].x].g = tentativeG;
                        maze[newOpens[i].y][newOpens[i].x].f = maze[newOpens[i].y][newOpens[i].x].g + h(newOpens[i]);
                    }
                }
            }
        } else {
            console.log("Open set empty");
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
            path = [{
                x: mazeWidth - 1,
                y: mazeHeight - 1
            }];
        } else {
            var lastElem = path[path.length - 1];
            if (maze[lastElem.y][lastElem.x].cameFrom) {
                path.push(maze[lastElem.y][lastElem.x].cameFrom);
            } else {
                // No more updates needed
                updateInfo = {
                    stage: 3
                }
                frameRate(1);
            }
        }
    }
}
