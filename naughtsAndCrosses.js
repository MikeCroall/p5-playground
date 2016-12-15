var canvasScale = 6;
var calculatedCanvasEdgeSize = 50;
var board;

function setup() {
	frameRate(60);
    
    calculatedCanvasEdgeSize = windowWidth / 16;
    if (windowHeight / 9 < calculatedCanvasEdgeSize) {
        calculatedCanvasEdgeSize = windowHeight / 9;
    }
    calculatedCanvasEdgeSize *= canvasScale;
	createCanvas(calculatedCanvasEdgeSize, calculatedCanvasEdgeSize);    

    board = new gameBoard();
}

function windowResized() {
    calculatedCanvasEdgeSize = windowWidth / 16;
    if (windowHeight / 9 < calculatedCanvasEdgeSize) {
        calculatedCanvasEdgeSize = windowHeight / 9;
    }
    calculatedCanvasEdgeSize *= canvasScale;
    resizeCanvas(calculatedCanvasEdgeSize, calculatedCanvasEdgeSize);
}

function draw() {
    background(51);
    board.draw();
}

function gameBoard() {
    this.board = [];
    for (var y = 0; y < 3; y++) {
        this.board[y] = [];
        for (var x = 0; x < 3; x++) {
            this.board[y].push(random(["","","o","x"]));
        }
    }
    
    this.draw = function() {
        var pieceEdgeSize = calculatedCanvasEdgeSize / 3;
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                noStroke();
                if (board.board[y][x] === "") {
                    fill(255);
                } else if (board.board[y][x] === "x") {
                    fill(255, 0, 0, 50);
                } else {
                    fill(0, 255, 0, 50);
                }
                rect(x*pieceEdgeSize, y*pieceEdgeSize, pieceEdgeSize, pieceEdgeSize);
            }
        }
    }
}