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
var tetrominos = [];
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

    if (tetrominos.length === 0) {
        newTetromino();
    }

    if (!paused) {
        if (tetrominos[tetrominos.length - 1].noFall) {
            delete tetrominos[tetrominos.length - 1].noFall;
        } else {
            if (tetrominos[tetrominos.length - 1].canFall()) {
                tetrominos[tetrominos.length - 1].fall();
            } else {
                if (checkForLoss()) {
                    paused = true;
                    infoMessage = "Game over! Score: " + score;
                } else {
                    checkFullLines();
                    newTetromino();
                }
            }
        }
    }

    for (var i = 0; i < tetrominos.length; i++) {
        tetrominos[i].draw();
    }

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
        tetrominos[tetrominos.length - 1].moveLeft();
    } else if (keyCode === RIGHT_ARROW) {
        tetrominos[tetrominos.length - 1].moveRight();
    } else if (keyCode === DOWN_ARROW) {
        frameRate(5 * baseTargetFrameRate);
    } else if (keyCode === UP_ARROW) {
        tetrominos[tetrominos.length - 1].rotate();
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
    var possibleChainReaction = false;
    do {
        possibleChainReaction = false;
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
            possibleChainReaction = true;
            // var lowestFullY = 22;
            // var highestFullY = 0;

            // Actually remove the full rows
            for (var i = 0; i < fullRowYs.length; i++) {
                // if (fullRowYs[i] < lowestFullY) {
                //     lowestFullY = fullRowYs[i];
                // }
                // if (fullRowYs[i] > highestFullY) {
                //     highestFullY = fullRowYs[i];
                // }
                for (var j = tetrominos.length - 1; j >= 0; j--) {
                    tetrominos[j].removeSquaresAtY(fullRowYs[i]);
                    if (tetrominos[j].markedForDeath) {
                        tetrominos.splice(j, 1);
                    } else if (tetrominos[j].markedForSeparation) {
                        var squares = tetrominos[j].separate();
                        tetrominos.splice(j, 1);
                        for (var k = 0; k < squares.length; k++) {
                            tetrominos.push(new Tetromino(squares[k].x, squares[k].y, squares[k].pieceID, null, squares[k], k));
                        }
                    }
                }
            }

            // TODO Now to make all tetrominos above highestFullY fall highestFullY - lowestFullY levels

        }

        // Update tetrominos that now have space beneath them
        var fallingTetrominos = 0;
        do {
            fallingTetrominos = 0;
            for (var x = tetrominos.length - 1; x >= 0; x--) {
                if (tetrominos[x].canFall()) {
                    fallingTetrominos++;
                    tetrominos[x].fall();
                }
            }
        } while (fallingTetrominos > 0);

        score += 100 * fullRowYs.length;
        infoMessage = "Score: " + score;
    } while (possibleChainReaction);
}

function checkForLoss() {
    return tetrominos[tetrominos.length - 1].isInLosingPosition();
}

function newTetromino() {
    var id = "#" + nextTetrominoId++;
    var type = Math.floor(Math.random() * 7);
    tetrominos.push(new Tetromino(4, 0, id, type));
}
