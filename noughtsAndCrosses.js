var canvasScale = 8;
var calculatedCanvasEdgeSize = 50;
var pieceEdgeSize = 10;
var paddedWidth = pieceEdgeSize - 10;
var board;
var winner = {
    found: false,
    draw: false,
    piece: "",
    start: {
        x: -1,
        y: -1
    },
    end: {
        x: -1,
        y: -1
    }
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
                if (board.playerTurn && !winner.found && !winner.draw) {
                    if (board.board[y][x] === "") {
                        board.playerTurn = false;
                        board.board[y][x] = "o";
                        winner = hasWon(board);
                        if (!winner.found && !winner.draw) {
                            aiTakeTurn();
                            winner = hasWon(board);
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
    /*console.log("TODO make computer player use MiniMax algorithm");
    var x = floor(random(3));
    var y = floor(random(3));
    while(board.board[y][x] !== "") {
        x = floor(random(3));
        y = floor(random(3));
    }*/
    
    // TODO currently, minimax-ing is not perfect... not sure how
    var move = minimax(board, 0).choice;
    
    board.board[move.y][move.x] = "x";
    board.playerTurn = true;
}

function boardScore(b, depth) {
    var winningPlayer = hasWon(b);
    if (winningPlayer.found) {
        if (winningPlayer.piece === "x") { // because ai is x pieces
            return 10 - depth;
        } else {
            return depth - 10;
        }
    }
    return 0;
}

function minimax(b, depth) {
    var w = hasWon(b);
    if (w.found || w.draw) {
        return {
            choice: null,
            score: boardScore(b, depth)
        };
    }
    var scores = [];
    var moves = [];

    var possibleMoves = b.getAvailableMoves();
    for (var i = 0; i < possibleMoves.length; i++) {
        var possibleGame = b.getStateAfterPlacing(possibleMoves[i]);
        scores.push(minimax(possibleGame, depth + 1).score);
        moves.push(possibleMoves[i]);
    }

    if (!b.playerTurn) {
        var maxScoreIndex = 0;
        var maxScore = scores[0];
        for (var i = 0; i < scores.length; i++) {
            if (scores[i] > maxScore) {
                maxScore = scores[i];
                maxScoreIndex = i;
            }
        }
        return {
            choice: moves[maxScoreIndex],
            score: scores[maxScoreIndex]
        };
    } else {
        var minScoreIndex = 0;
        var minScore = scores[0];
        for (var i = 0; i < scores.length; i++) {
            if (scores[i] < minScore) {
                minScore = scores[i];
                minScoreIndex = i;
            }
        }
        return {
            choice: moves[minScoreIndex],
            score: scores[minScoreIndex]
        };
    }
}

function hasWon(b) {
    var winnerFound = {
        found: false,
        draw: false,
        piece: "",
        start: {
            x: -1,
            y: -1
        },
        end: {
            x: -1,
            y: -1
        }
    };
    for (var y = 0; y < 3; y++) {
        if (
            b.board[y][0] === b.board[y][1] &&
            b.board[y][1] === b.board[y][2]
        ) {
            if (b.board[y][0] !== "") {
                winnerFound.found = true;
                winnerFound.piece = b.board[y][0]; 
                winnerFound.start = {x:0, y:y};
                winnerFound.end = {x:2, y:y};
                break;
            }
        }
    }
    if (!winnerFound.found) {
        for (var x = 0; x < 3; x++) {
            if (
                b.board[0][x] === b.board[1][x] &&
                b.board[1][x] === b.board[2][x]
            ) {
                if (b.board[0][x] !== "") {
                    winnerFound.found = true;
                    winnerFound.piece = b.board[0][x]; 
                    winnerFound.start = {x:x, y:0};
                    winnerFound.end = {x:x, y:2};
                    break;
                }
            }
        }
    }
    if (!winnerFound.found) {
        if (b.board[1][1] !== "") {
            if (
                b.board[0][0] === b.board[1][1] &&
                b.board[1][1] === b.board[2][2]
            ) {
                winnerFound.found = true;
                winnerFound.piece = b.board[1][1];
                winnerFound.start = {x:0, y:0};
                winnerFound.end = {x:2, y:2};
            } else if (
                b.board[0][2] === b.board[1][1] &&
                b.board[1][1] === b.board[2][0]
            ) {
                winnerFound.found = true;
                winnerFound.piece = b.board[1][1];
                winnerFound.start = {x:2, y:0};
                winnerFound.end = {x:0, y:2};
            }
        }
    }
    if (winnerFound.found) {
        return winnerFound;
    } else {
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                if (b.board[y][x] === "") {
                    // when checking for a draw, if we encounter an empty piece, we haven't drawn yet
                    return winnerFound;
                }
            }
        }
        winnerFound.draw = true;
        return winnerFound;
    }
    return winnerFound;
}

function draw() {
    background(51);
    board.draw();
}

function gameBoard(grid) {
    this.playerTurn = true;
    if (grid) {
        this.board = grid;
    } else {
        this.board = [];
        for (var y = 0; y < 3; y++) {
            this.board[y] = [];
            for (var x = 0; x < 3; x++) {
                //this.board[y].push(random(["","","o","x"]));
                this.board[y].push("");
            }
        }
    }
    
    this.getAvailableMoves = function() {
        var moves = [];
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                if (this.board[y][x] === "") {
                    moves.push({
                        x: x, 
                        y: y
                    });
                }
            }
        }
        return moves;
    }
    
    this.getStateAfterPlacing = function(move) {
        var newBoard = new gameBoard();
        newBoard.board = [];
        for (var y = 0; y < 3; y++) {
            newBoard.board[y] = [];
            for (var x = 0; x < 3; x++) {
                newBoard.board[y][x] = this.board[y][x].slice();
            }
        }
        newBoard.playerTurn = !this.board.playerTurn;
        newBoard.board[move.y][move.x] = this.board.playerTurn ? "o" : "x";
        return newBoard;
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
                    if (this.board[y][x] === "") {
                        if (this.playerTurn && !winner.found) {
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
                        fill(255, 150);
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
        if (winner.found) {
            if (winner.piece === "x"){
                stroke(255, 0, 0);
            } else {
                stroke(0, 255, 0);
            }
            strokeWeight(16);
            strokeCap(ROUND);
            noFill();
            line((winner.start.x+0.5) * pieceEdgeSize, (winner.start.y+0.5) * pieceEdgeSize, (winner.end.x+0.5) * pieceEdgeSize, (winner.end.y+0.5) * pieceEdgeSize);
        }
        var fps = floor(frameRate());
        if (fps > 60) { fps = 60; }
        noStroke();
        textSize(32);
        fpsDiv.style("color", color(map(fps, 0, 60, 255, 0), map(fps, 0, 60, 0, 255), 0));
        fpsDiv.html("" + fps + " fps");
    }
}