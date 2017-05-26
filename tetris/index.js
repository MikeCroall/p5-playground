// Originally created by Mike Croall https://github.com/MikeCroall/p5-playground
var canvasScale = 8;

// Grid is 10x22 with the top 2 hidden
var calcCanvasHeight = 20;
var calcCanvasWidth = 10;
var pieceEdgeSize = 1;

var infoDiv;
var infoMessage;
var btnReset;

var nextTetrominoId = 1;
var tetrominos = [];
var pieceCheck = [];

function setup() {
    infoMessage = "Setting up game...";
    frameRate(3);

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
    infoMessage = "Game starting";
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
            // TODO check for completed lines
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
    if (keyCode === LEFT_ARROW) {
        tetrominos[tetrominos.length - 1].moveLeft();
    } else if (keyCode === RIGHT_ARROW) {
        tetrominos[tetrominos.length - 1].moveRight();
    }
    // TODO support rotation of tetrominos
    return false;
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

function newTetromino() {
    var id = "#" + nextTetrominoId++;
    tetrominos.push(new Tetromino(4, 0, id));
}
