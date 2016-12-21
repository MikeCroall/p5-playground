var INITIAL_SPAWN_COUNT = 50;
var DISTANCE_TO_CONNECT = 200;
var MAX_NODE_SPEED = 0.75;

var nodes;

function setup() {
    frameRate(60);
    createCanvas(windowWidth, windowHeight);

    nodes = [];
    for (var i = 0; i < INITIAL_SPAWN_COUNT; i++) {
        nodes.push(new Node(random(width), random(height)));
    }
}

function windowResized() {
    setup();
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(51);
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].update();
    }

    // Check each nodes' neighbours, only one way edges to be quicker to run
    for (var i = 0; i < nodes.length - 1; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
            var a = nodes[i];
            var b = nodes[j];

            if (dist(a.x, a.y, b.x, b.y) < DISTANCE_TO_CONNECT) {
                stroke(255);
                strokeWeight(2);
                noFill();
                line(a.x, a.y, b.x, b.y);
            }
        }
    }

    for (var i = 0; i < nodes.length; i++) {
        nodes[i].draw();
    }
}

function Node(xin, yin) {
    this.x = xin;
    this.y = yin;
    this.xv = random(-MAX_NODE_SPEED, MAX_NODE_SPEED);
    this.yv = random(-MAX_NODE_SPEED, MAX_NODE_SPEED);
    this.r = 5;

    this.neighbours = [];

    this.update = function() {
        this.x += this.xv;
        this.y += this.yv;
        this.boundaryWrap();
    }

    this.draw = function() {
        noStroke();
        fill(255);
        ellipse(this.x, this.y, 2 * this.r);
    }

    this.boundaryWrap = function() {
        if (this.x + this.r < 0) {
            this.x = width + this.r;
        }
        if (this.x - this.r > width) {
            this.x = -this.r;
        }
        if (this.y + this.r < 0) {
            this.y = height + this.r;
        }
        if (this.y - this.r > height) {
            this.y = -this.r;
        }
    }
}
