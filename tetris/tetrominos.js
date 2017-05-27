// Originally created by Mike Croall https://github.com/MikeCroall/p5-playground

function Tetromino(x, y, pieceID, type) {
    this.x = x;
    this.y = y;
    this.pieceID = pieceID;
    this.squares = [];

    if (type === 0) { // Square
        this.colour = color(255, 255, 0);
        this.squares.push(new Square(this.x, this.y, this.pieceID, this.colour));
        this.squares.push(new Square(this.x + 1, this.y, this.pieceID, this.colour));
        this.squares.push(new Square(this.x, this.y + 1, this.pieceID, this.colour));
        this.squares.push(new Square(this.x + 1, this.y + 1, this.pieceID, this.colour));
    } else if (type === 1) { // T
        this.colour = color(255, 0, 255);
        this.squares.push(new Square(this.x, this.y, this.pieceID, this.colour));
        this.squares.push(new Square(this.x + 1, this.y, this.pieceID, this.colour));
        this.squares.push(new Square(this.x + 2, this.y, this.pieceID, this.colour));
        this.squares.push(new Square(this.x + 1, this.y + 1, this.pieceID, this.colour));
    } else if (type === 2) { // |
        this.colour = color(0, 255, 255);
        this.squares.push(new Square(this.x, this.y - 1, this.pieceID, this.colour));
        this.squares.push(new Square(this.x, this.y, this.pieceID, this.colour));
        this.squares.push(new Square(this.x, this.y + 1, this.pieceID, this.colour));
        this.squares.push(new Square(this.x, this.y + 2, this.pieceID, this.colour));
    } else if (type === 3) { // L
        this.colour = color(255, 153, 0);
        this.squares.push(new Square(this.x, this.y - 1, this.pieceID, this.colour));
        this.squares.push(new Square(this.x, this.y, this.pieceID, this.colour));
        this.squares.push(new Square(this.x, this.y + 1, this.pieceID, this.colour));
        this.squares.push(new Square(this.x + 1, this.y + 1, this.pieceID, this.colour));
    } else if (type === 4) { // reverse L
        this.colour = color(0, 0, 255);
        this.squares.push(new Square(this.x, this.y - 1, this.pieceID, this.colour));
        this.squares.push(new Square(this.x, this.y, this.pieceID, this.colour));
        this.squares.push(new Square(this.x, this.y + 1, this.pieceID, this.colour));
        this.squares.push(new Square(this.x - 1, this.y + 1, this.pieceID, this.colour));
    } else if (type === 5) { // zigzag
        this.colour = color(0, 255, 0);
        this.squares.push(new Square(this.x, this.y - 1, this.pieceID, this.colour));
        this.squares.push(new Square(this.x + 1, this.y - 1, this.pieceID, this.colour));
        this.squares.push(new Square(this.x, this.y, this.pieceID, this.colour));
        this.squares.push(new Square(this.x - 1, this.y, this.pieceID, this.colour));
    } else if (type === 6) { // reverse zigzag
        this.colour = color(255, 0, 0);
        this.squares.push(new Square(this.x, this.y - 1, this.pieceID, this.colour));
        this.squares.push(new Square(this.x - 1, this.y - 1, this.pieceID, this.colour));
        this.squares.push(new Square(this.x, this.y, this.pieceID, this.colour));
        this.squares.push(new Square(this.x + 1, this.y, this.pieceID, this.colour));
    }

    this.canFall = function() {
        for (var i = 0; i < this.squares.length; i++) {
            if (!this.squares[i].canFall()) {
                return false;
            }
        }
        return true;
    }

    this.canMoveLeft = function() {
        for (var i = 0; i < this.squares.length; i++) {
            if (!this.squares[i].canMoveLeft()) {
                return false;
            }
        }
        return true;
    }

    this.canMoveRight = function() {
        for (var i = 0; i < this.squares.length; i++) {
            if (!this.squares[i].canMoveRight()) {
                return false;
            }
        }
        return true;
    }

    this.fall = function() {
        this.y += 1;

        // The first two loops here are separate to avoid overwriting
        for (var i = 0; i < this.squares.length; i++) {
            setPieceCheck(this.squares[i].x, this.squares[i].y, false);
        }

        for (var i = 0; i < this.squares.length; i++) {
            this.squares[i].fall();
        }

        for (var i = 0; i < this.squares.length; i++) {
            setPieceCheck(this.squares[i].x, this.squares[i].y, this.pieceID);
        }
    }

    this.moveLeft = function() {
        if (this.canMoveLeft()) {
            this.x--;
            for (var i = 0; i < this.squares.length; i++) {
                setPieceCheck(this.squares[i].x, this.squares[i].y, false);
            }
            for (var i = 0; i < this.squares.length; i++) {
                this.squares[i].x--;
            }
            for (var i = 0; i < this.squares.length; i++) {
                setPieceCheck(this.squares[i].x, this.squares[i].y, this.pieceID);
            }
            this.noFall = true;
            draw();
        }
    }

    this.moveRight = function() {
        if (this.canMoveRight()) {
            this.x++;
            for (var i = 0; i < this.squares.length; i++) {
                setPieceCheck(this.squares[i].x, this.squares[i].y, false);
            }
            for (var i = 0; i < this.squares.length; i++) {
                this.squares[i].x++;
            }
            for (var i = 0; i < this.squares.length; i++) {
                setPieceCheck(this.squares[i].x, this.squares[i].y, this.pieceID);
            }
            this.noFall = true;
            draw();
        }
    }

    this.draw = function() {
        for (var i = 0; i < this.squares.length; i++) {
            this.squares[i].draw();
        }
    }
}

function Square(x, y, pieceID, col) {
    this.x = x;
    this.y = y;
    this.colour = col;
    this.pieceID = pieceID;

    setPieceCheck(x, y, pieceID);

    this.canFall = function() {
        return getPieceCheck(this.x, this.y + 1) === false || getPieceCheck(this.x, this.y + 1) === this.pieceID;
    }

    this.canMoveLeft = function() {
        return getPieceCheck(this.x - 1, this.y) === false || getPieceCheck(this.x - 1, this.y) === this.pieceID;
    }

    this.canMoveRight = function() {
        return getPieceCheck(this.x + 1, this.y) === false || getPieceCheck(this.x + 1, this.y) === this.pieceID;
    }

    this.fall = function() {
        this.y += 1;
    }

    this.draw = function() {
        strokeWeight(2);
        stroke(0);
        fill(this.colour);
        rect(this.x * pieceEdgeSize, (this.y - 2) * pieceEdgeSize, pieceEdgeSize, pieceEdgeSize)
    }
}
