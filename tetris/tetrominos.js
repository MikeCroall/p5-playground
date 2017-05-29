// Originally created by Mike Croall https://github.com/MikeCroall/p5-playground

const types = [
    { // Square
        col: {r:255, g:255, b:0},
        offsets: [
            {x:0, y:0},
            {x:1, y:0},
            {x:0, y:1},
            {x:1, y:1}
        ]
    },
    { // T
        col: {r:255, g:0, b:255},
        offsets: [
            {x:0, y:0},
            {x:-1, y:0},
            {x:1, y:0},
            {x:0, y:1}
        ]
    },
    { // |
        col: {r:0, g:255, b:255},
        offsets: [
            {x:0, y:0},
            {x:0, y:-1},
            {x:0, y:1},
            {x:0, y:2}
        ]
    },
    { // L
        col: {r:255, g:153, b:0},
        offsets: [
            {x:0, y:0},
            {x:0, y:-1},
            {x:0, y:1},
            {x:1, y:1}
        ]
    },
    { // reverse L
        col: {r:0, g:0, b:255},
        offsets: [
            {x:0, y:0},
            {x:0, y:-1},
            {x:0, y:1},
            {x:-1, y:1}
        ]
    },
    { // zigzag
        col: {r:0, g:255, b:0},
        offsets: [
            {x:0, y:0},
            {x:0, y:-1},
            {x:1, y:-1},
            {x:-1, y:0}
        ]
    },
    { // reverse zigzag
        col: {r:255, g:0, b:0},
        offsets: [
            {x:0, y:0},
            {x:0, y:-1},
            {x:-1, y:-1},
            {x:1, y:0}
        ]
    }
];

function Tetromino(x, y, pieceID, type, square, idAppend) {
    this.x = x;
    this.y = y;
    this.pieceID = pieceID;
    this.squares = [];

    if (!square && !idAppend) {
        // Type dependent
        this.colour = color(types[type].col.r, types[type].col.g, types[type].col.b);
        for (var i = 0; i < types[type].offsets.length; i++) {
            var o = types[type].offsets[i];
            this.squares.push(new Square(o.x, o.y, this.x, this.y, this.pieceID, this.colour));
        }
    } else {
        square.pieceID += "#" + idAppend;
        this.squares.push(square);
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

    this.canRotate = function() {
        for (var i = 0; i < this.squares.length; i++) {
            if (!this.squares[i].canRotate()) {
                return false;
            }
        }
        return true;
    }

    this.isInLosingPosition = function() {
        if (!this.canFall()) {
            for (var i = 0; i < this.squares.length; i++) {
                if (this.squares[i].y <= 1) {
                    return true;
                }
            }
        }
        return false;
    }

    this.separate = function() {
        // TODO return sets of squares that are still adjacent (diagonally doesn't count)
        return this.squares;
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
                this.squares[i].moveLeft();
            }
            for (var i = 0; i < this.squares.length; i++) {
                setPieceCheck(this.squares[i].x, this.squares[i].y, this.pieceID);
            }
            this.noFall = true;
            redraw();
        }
    }

    this.moveRight = function() {
        if (this.canMoveRight()) {
            this.x++;
            for (var i = 0; i < this.squares.length; i++) {
                setPieceCheck(this.squares[i].x, this.squares[i].y, false);
            }
            for (var i = 0; i < this.squares.length; i++) {
                this.squares[i].moveRight();
            }
            for (var i = 0; i < this.squares.length; i++) {
                setPieceCheck(this.squares[i].x, this.squares[i].y, this.pieceID);
            }
            this.noFall = true;
            redraw();
        }
    }

    this.rotate = function() {
        if (this.canRotate()) {
            for (var i = 0; i < this.squares.length; i++) {
                setPieceCheck(this.squares[i].x, this.squares[i].y, false);
            }
            for (var i = 0; i < this.squares.length; i++) {
                this.squares[i].rotate();
            }
            for (var i = 0; i < this.squares.length; i++) {
                setPieceCheck(this.squares[i].x, this.squares[i].y, this.pieceID);
            }
            this.noFall = true;
            redraw();
        }
    }

    this.removeSquaresAtY = function(y) {
        for (var i = this.squares.length - 1; i >= 0; i--) {
            if (this.squares[i].y === y) {
                setPieceCheck(this.squares[i].x, y, false);
                this.squares.splice(i, 1);
                this.markedForSeparation = true;
            }
        }
        if (this.squares.length === 0) {
            this.markedForDeath = true;
        }
    }

    this.draw = function() {
        for (var i = 0; i < this.squares.length; i++) {
            this.squares[i].draw();
        }
    }
}

function Square(xOff, yOff, x, y, pieceID, col) {
    this.corX = x;
    this.corY = y;
    this.x = this.corX + xOff;
    this.y = this.corY + yOff;

    this.colour = col;
    this.pieceID = pieceID;

    setPieceCheck(x, y, pieceID);

    this.wouldRotateInto = function () {
        const angleOfRotation = PI / 2;
        var x = this.corX + (this.x - this.corX) * cos(angleOfRotation) - (this.y - this.corY) * sin(angleOfRotation);
        var y = this.corY + (this.x - this.corX) * sin(angleOfRotation) + (this.y - this.corY) * cos(angleOfRotation);
        return {x:x, y:y};
    }

    this.canFall = function() {
        return getPieceCheck(this.x, this.y + 1) === false || getPieceCheck(this.x, this.y + 1) === this.pieceID;
    }

    this.canMoveLeft = function() {
        return getPieceCheck(this.x - 1, this.y) === false || getPieceCheck(this.x - 1, this.y) === this.pieceID;
    }

    this.canMoveRight = function() {
        return getPieceCheck(this.x + 1, this.y) === false || getPieceCheck(this.x + 1, this.y) === this.pieceID;
    }

    this.canRotate = function() {
        var rotateTarget = this.wouldRotateInto();
        return getPieceCheck(rotateTarget.x, rotateTarget.y) === false || getPieceCheck(rotateTarget.x, rotateTarget.y) === this.pieceID;
    }

    this.fall = function() {
        this.corY += 1;
        this.y += 1;
    }

    this.moveLeft = function() {
        this.corX--;
        this.x--;
    }

    this.moveRight = function() {
        this.corX++;
        this.x++;
    }

    this.rotate = function() {
        var rotateTarget = this.wouldRotateInto();
        this.x = rotateTarget.x;
        this.y = rotateTarget.y;
    }

    this.draw = function() {
        strokeWeight(2);
        stroke(0);
        fill(this.colour);
        rect(this.x * pieceEdgeSize, (this.y - 2) * pieceEdgeSize, pieceEdgeSize, pieceEdgeSize);
        if (this.xOff === this.yOff && this.xOff === 0) {
            fill(51);
            ellipse((this.x + 0.5) * pieceEdgeSize, (this.y - 2 + 0.5) * pieceEdgeSize, pieceEdgeSize * 0.2, pieceEdgeSize * 0.2);
        }
    }
}
