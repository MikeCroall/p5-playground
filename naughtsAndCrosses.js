var canvasScale = 8;
var calculatedCanvasEdgeSize = 50;
var pieceEdgeSize = 10;
var paddedWidth = pieceEdgeSize - 10;
var playerTurn = true;
var board;
var winner = {
    found: false,
    draw: false,
    piece: ""
};

var fpsDiv;

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
    fpsDiv = select('#fps');
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
                if (playerTurn && !winner.found && !winner.draw) {
                    if (board.board[y][x] === "") {
                        playerTurn = false;
                        board.board[y][x] = "o";
                        winner = hasWon();
                        if (!winner.found && !winner.draw) {
                            aiTakeTurn();
                            winner = hasWon();
                        }
                    } else {
                        alert("You can't go there!");
                    }
                } else {
                    alert("You can't play now!");
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
    var winnerFound = {
        found: false,
        draw: false,
        piece: ""
    };
    for (var y = 0; y < 3; y++) {
        if (
            board.board[y][0] === board.board[y][1] &&
            board.board[y][1] === board.board[y][2]
        ) {
            if (board.board[y][0] !== "") {
                winnerFound.found = true;
                winnerFound.piece = board.board[y][0]; 
                break;
            }
        }
    }
    if (!winnerFound.found) {
        for (var x = 0; x < 3; x++) {
            if (
                board.board[0][x] === board.board[1][x] &&
                board.board[1][x] === board.board[2][x]
            ) {
                if (board.board[0][x] !== "") {
                    winnerFound.found = true;
                    winnerFound.piece = board.board[0][x]; 
                    break;
                }
            }
        }
    }
    if (!winnerFound.found) {
        if (
            board.board[0][0] === board.board[1][1] &&
            board.board[1][1] === board.board[2][2]
            ||
            board.board[0][2] === board.board[1][1] &&
            board.board[1][1] === board.board[2][0]
        ) {
            if (board.board[1][1] !== "") {
                winnerFound.found = true;
                winnerFound.piece = board.board[1][1];
            }
        }
    }
    if (winnerFound.found) {
        console.log("We have a winner", winnerFound.piece);
        return winnerFound;
    } else {
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                if (board.board[y][x] === "") {
                    // when checking for a draw, if we encounter an empty piece, we haven't drawn yet
                    return winnerFound;
                }
            }
        }
        console.log("It's a draw!");
        winnerFound.draw = true;
        return winnerFound;
    }
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
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                var topLeft = {
                    x: x * pieceEdgeSize + 5,
                    y: y * pieceEdgeSize + 5
                };
                var drawnSquare = false;
                if (hoveringOver(topLeft)) {
                    if (board.board[y][x] === "") {
                        if (playerTurn && !winner.found) {
                            noStroke();
                            fill(255);
                            rect(topLeft.x, topLeft.y, paddedWidth, paddedWidth);
                            fill(0, 255, 0, 150);
                            rect(topLeft.x, topLeft.y, paddedWidth, paddedWidth);
                            drawnSquare = true;
                        }
                    }
                }
                if (!drawnSquare) {
                    noStroke();
                    if (!winner.found && !winner.draw) {
                        fill(255);
                    } else {
                        fill(255, 51);
                    }
                    rect(topLeft.x, topLeft.y, paddedWidth, paddedWidth);
                    if (board.board[y][x] === "x") {
                        noFill();
                        strokeWeight(4);
                        stroke(255, 0, 0, 150);
                        line(topLeft.x + 0.05*paddedWidth, topLeft.y + 0.05*paddedWidth, topLeft.x + paddedWidth*0.95, topLeft.y + paddedWidth*0.95);
                        line(topLeft.x + 0.05*paddedWidth, topLeft.y + paddedWidth*0.95, topLeft.x + paddedWidth*0.95, topLeft.y + 0.05*paddedWidth);
                    } else if (board.board[y][x] === "o") {
                        noFill();
                        strokeWeight(4);
                        stroke(0, 255, 0, 150);
                        ellipse(topLeft.x + paddedWidth/2, topLeft.y + paddedWidth/2, paddedWidth*0.9, paddedWidth*0.9);
                    }
                }
            }
        }
        var fps = floor(frameRate());
        if (fps > 60) { fps = 60; }
        noStroke();
        textSize(32);
        fpsDiv.style("color", color(map(fps, 0, 60, 255, 0), map(fps, 0, 60, 0, 255), 0));
        fpsDiv.html("" + fps + " fps");
    }
}