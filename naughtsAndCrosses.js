var canvasScale = 8;
var calculatedCanvasEdgeSize = 50;
var pieceEdgeSize = 10;
var paddedWidth = pieceEdgeSize - 10;
var playerTurn = true;
var board;
var winner = "";

function setup() {
	frameRate(60);
    
    calculatedCanvasEdgeSize = windowWidth / 16;
    if (windowHeight / 9 < calculatedCanvasEdgeSize) {
        calculatedCanvasEdgeSize = windowHeight / 9;
    }
    calculatedCanvasEdgeSize *= canvasScale;
    pieceEdgeSize = calculatedCanvasEdgeSize / 3;
    paddedWidth = pieceEdgeSize - 10;
	createCanvas(calculatedCanvasEdgeSize, calculatedCanvasEdgeSize);    

    board = new gameBoard();
}

function windowResized() {
    calculatedCanvasEdgeSize = windowWidth / 16;
    if (windowHeight / 9 < calculatedCanvasEdgeSize) {
        calculatedCanvasEdgeSize = windowHeight / 9;
    }
    calculatedCanvasEdgeSize *= canvasScale;
    pieceEdgeSize = calculatedCanvasEdgeSize / 3;
    paddedWidth = pieceEdgeSize - 10;
    resizeCanvas(calculatedCanvasEdgeSize, calculatedCanvasEdgeSize);
}

function hoveringOver(topLeft) {
    return (mouseX > topLeft.x && mouseX < topLeft.x + paddedWidth && mouseY > topLeft.y && mouseY < topLeft.y + paddedWidth);
}

function mouseClicked() {
    for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 3; x++) {
            var topLeft = {
                x: x * pieceEdgeSize + 5,
                y: y * pieceEdgeSize + 5
            };
            if (hoveringOver(topLeft)) {
                if (playerTurn && winner === "") {
                    if (board.board[y][x] === "") {
                        playerTurn = false;
                        board.board[y][x] = "o";
                        winner = hasWon();
                        if (winner === "") {
                            aiTakeTurn();
                        }
                    } else {
                        alert("You can't go there!");
                    }
                } else {
                    alert("Not your turn!");
                }
                break;
            }
        }
    }
}

function aiTakeTurn() {
    console.log("TODO make computer player use MiniMax algorithm");
    var x = floor(random(3));
    var y = floor(random(3));
    while(board.board[y][x] !== "") {
        x = floor(random(3));
        y = floor(random(3));
    }
    board.board[y][x] = "x";
    playerTurn = true;
}

function hasWon() {
    var winnerFound = "";
    for (var y = 0; y < 3; y++) {
        if (
            board.board[y][0] === board.board[y][1] &&
            board.board[y][1] === board.board[y][2]
        ) {
            winnerFound = board.board[y][0]; 
            break;
        }
    }
    if (winnerFound === "") {
        for (var x = 0; x < 3; x++) {
            if (
                board.board[0][x] === board.board[1][x] &&
                board.board[1][x] === board.board[2][x]
            ) {
                winnerFound = board.board[0][x]; 
                break;
            }
        }
    }
    if (winnerFound === "") {
        if (
            board.board[0][0] === board.board[1][1] &&
            board.board[1][1] === board.board[2][2]
            ||
            board.board[0][2] === board.board[1][1] &&
            board.board[1][1] === board.board[2][0]
        ) {
            winnerFound = board.board[1][1];
        }
    }
    if (winnerFound !== "") {
        console.log("WE HAVE A WINNER", winnerFound);
    } else {
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                if (board.board[y][x] === "") {
                    return "";
                    // checking for a draw, if we encounter an empty piece, we haven't drawn yet
                }
            }
        }
        console.log("It's a draw!");
        winnerFound = "DRAW";
    }
    return winnerFound;
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
            //this.board[y].push(random(["","","o","x"]));
            this.board[y].push("");
        }
    }
    
    this.draw = function() {
        noStroke();
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                var topLeft = {
                    x: x * pieceEdgeSize + 5,
                    y: y * pieceEdgeSize + 5
                };
                var drawnSquare = false;
                if (hoveringOver(topLeft)) {
                    if (board.board[y][x] === "") {
                        if (playerTurn) {
                            fill(255);
                            rect(topLeft.x, topLeft.y, paddedWidth, paddedWidth);
                            fill(0, 255, 0, 150);
                            rect(topLeft.x, topLeft.y, paddedWidth, paddedWidth);
                            drawnSquare = true;
                        }
                    }
                }
                if (!drawnSquare) {
                    if (board.board[y][x] === "") {
                        fill(255);
                    } else if (board.board[y][x] === "x") {
                        fill(255, 0, 0, 150);
                    } else {
                        fill(0, 255, 0, 150);
                    }
                    rect(topLeft.x, topLeft.y, paddedWidth, paddedWidth);
                }
            }
        }
    }
}