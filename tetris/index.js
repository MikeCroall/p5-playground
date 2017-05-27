// Originally created by Mike Croall https://github.com/MikeCroall/p5-playground
var canvasScale = 8;

// Grid is 10x22 with the top 2 hidden
var calcCanvasHeight = 20;
var calcCanvasWidth = 10;
var pieceEdgeSize = 1;

var infoDiv;
var infoMessage;

var baseTargetFrameRate = 3;

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

    newTetromino();

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

    if (tetrominos[tetrominos.length - 1].noFall) {
        delete tetrominos[tetrominos.length - 1].noFall;
    } else {
        if (tetrominos[tetrominos.length - 1].canFall()) {
            tetrominos[tetrominos.length - 1].fall();
        } else {
            checkFullLines();
            newTetromino();
            // TODO check for losing
        }
    }

    for (var i = 0; i < tetrominos.length; i++) {
        tetrominos[i].draw();
    }

    infoDiv.html(infoMessage);
}

function keyPressed() {
    // TODO support holding of left/right arrow instead of single press, keyPressed/keyReleasted/keyTyped never repeat on hold for my laptop :/
    if (keyCode === LEFT_ARROW) {
        tetrominos[tetrominos.length - 1].moveLeft();
    } else if (keyCode === RIGHT_ARROW) {
        tetrominos[tetrominos.length - 1].moveRight();
    } else if (keyCode === DOWN_ARROW) {
        frameRate(5 * baseTargetFrameRate);
    } else if (keyCode == UP_ARROW) {
        // TODO rotate (always clockwise)
        console.error("Rotation not yet implemented");
    } else {
        // Unrecognised, allow browser default
        return;
    }
    
    return false;
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
            } else if (pieces === 0) {
                // Empty row, can't be anything above, stop checking
                break;
            }
        }

        if (fullRowYs.length > 0) {
            // Actually remove the full rows
            for (var i = 0; i < fullRowYs.length; i++) {
                for (var j = tetrominos.length - 1; j >= 0; j--) {
                    tetrominos[j].removeSquaresAtY(fullRowYs[i]);
                    if (tetrominos[j].markedForDeath) {
                        tetrominos.splice(j, 1);
                    }
                }
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
            possibleChainReaction = true;
        }
    } while (possibleChainReaction);
}

function newTetromino() {
    var id = "#" + nextTetrominoId++;
    var type = Math.floor(Math.random() * 7);
    tetrominos.push(new Tetromino(4, 0, id, type));
}
