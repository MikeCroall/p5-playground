// Originally created by Mike Croall https://github.com/MikeCroall/p5-playground
var canvasScale = 8;

// Grid is 10x22 with the top 2 hidden
var calcCanvasHeight = 20;
var calcCanvasWidth = 10;
var pieceEdgeSize = 1;

var infoDiv;
var infoMessage;

var baseTargetFrameRate = 3;

var paused = false;
var nextTetrominoId = 1;
var tetromino;
var placedSquares = [];
var pieceCheck = [];
var score = 0;

function setup() {
    infoMessage = "Setting up game...";
    frameRate(baseTargetFrameRate);

    calcCanvasHeight = windowHeight * 0.9;
    calcCanvasWidth = calcCanvasHeight / 2;
    pieceEdgeSize = calcCanvasWidth / 10;
    createCanvas(calcCanvasWidth, calcCanvasHeight);

    for (var i = 0; i < 10; i++) {
        var column = [];
        for (var j = 0; j < 22; j++) {
            column.push(false);
        }
        pieceCheck.push(column);
    }

    infoDiv = select("#info");
    infoMessage = "Score: " + score;
}

function windowResized() {
    calcCanvasHeight = windowHeight * 0.9;
    calcCanvasWidth = calcCanvasHeight / 2;
    pieceEdgeSize = calcCanvasWidth / 10;
    resizeCanvas(calcCanvasWidth, calcCanvasHeight);
}

function draw() {
    background(51);

    if (!tetromino) {
        newTetromino();
    }

    if (!paused) {
        if (tetromino.noFall) {
            delete tetromino.noFall;
        } else {
            if (tetromino.canFall()) {
                tetromino.fall();
            } else {
                if (checkForLoss()) {
                    paused = true;
                    infoMessage = "Game over! Score: " + score;
                } else {
                    newTetromino();
                    checkFullLines();
                }
            }
        }
    }

    for (var i = 0; i < placedSquares.length; i++) {
        placedSquares[i].draw();
    }
    tetromino.draw();

    infoDiv.html(infoMessage);

    if (paused) {
        noStroke();
        fill(color(51, 51, 51, 200));
        rect(0, 0, width, height);
        noLoop();
    }
}

function keyPressed() {
    if (paused) {
        // Don't allow movement while paused
        if (keyCode === 32) {
            paused = false;
            loop();
        }
    } else if (keyCode === LEFT_ARROW) {
        // TODO support holding of left/right arrow instead of single press, keyPressed/keyReleasted/keyTyped never repeat on hold for my laptop :/
        tetromino.moveLeft();
    } else if (keyCode === RIGHT_ARROW) {
        tetromino.moveRight();
    } else if (keyCode === DOWN_ARROW) {
        frameRate(5 * baseTargetFrameRate);
    } else if (keyCode === UP_ARROW) {
        tetromino.rotate();
    } else if (keyCode === 32) {
        paused = true;
        noLoop();
        redraw();
    } else {
        // Unrecognised, allow browser default
        return;
    }
}

function keyReleased() {
    if (keyCode === DOWN_ARROW) {
        frameRate(baseTargetFrameRate);
    }
}

function getPieceCheck(x, y) {
    if (pieceCheck[x] === undefined) {
        return undefined;
    }
    if (pieceCheck[x][y] === undefined) {
        return undefined;
    }
    return pieceCheck[x][y];
}

function setPieceCheck(x, y, value) {
    if (pieceCheck[x] === undefined) {
        return;
    }
    if (pieceCheck[x][y] === undefined) {
        return;
    }
    pieceCheck[x][y] = value;
}

function checkFullLines() {
    // Find the full rows
    var fullRowYs = [];
    for (var y = pieceCheck[0].length - 1; y >= 0; y--) {
        var pieces = 0;
        for (var x = 0; x < pieceCheck.length; x++) {
            if (getPieceCheck(x, y)) {
                pieces++;
            }
        }

        if (pieces === 10) {
            fullRowYs.push(y);
        }
    }

    if (fullRowYs.length > 0) {
        // Top to bottom (for cascade of falling rows to be made easy)
        for (var i = fullRowYs.length - 1; i >= 0; i--) {
            // Actually remove the full rows
            for (var j = placedSquares.length - 1; j >= 0; j--) {
                if (placedSquares[j].y === fullRowYs[i]) {
                    setPieceCheck(placedSquares[j].x, fullRowYs[i], false);
                    placedSquares.splice(j, 1);
                }
            }

            var toFall = [];
            // Handle falling of higher rows
            for (var j = placedSquares.length - 1; j >= 0; j--) {
                if (placedSquares[j].y < fullRowYs[i]) {
                    toFall.push(placedSquares[j]);
                }
            }

            for (var j = 0; j < toFall.length; j++) {
                setPieceCheck(toFall[j].x, toFall[j].y, false);
            }
            for (var j = 0; j < toFall.length; j++) {
                toFall[j].y++;
            }
            for (var j = 0; j < toFall.length; j++) {
                setPieceCheck(toFall[j].x, toFall[j].y, toFall[j].pieceID);
            }
        }
    }

    score += 100 * fullRowYs.length;
    infoMessage = "Score: " + score;
}

function checkForLoss() {
    return tetromino.isInLosingPosition();
}

function newTetromino() {
    if (tetromino) {
        placedSquares.push.apply(placedSquares, tetromino.separate());
    }
    var id = "#" + nextTetrominoId++;
    var type = Math.floor(Math.random() * 7);
    tetromino = new Tetromino(4, 0, id, type);
}
