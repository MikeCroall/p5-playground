var totalNodeCount = 75;
var distanceToConnect = 200;
var showDistance =  false;
var MAX_NODE_SPEED = 0.75;

var nodes;
var settingsGui;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(30);
    settingsGui = createGui("Settings");
    sliderRange(10, 100, 5);
    settingsGui.addGlobals("totalNodeCount");
    sliderRange(100, 300, 5);
    settingsGui.addGlobals("distanceToConnect");
    settingsGui.addGlobals("showDistance");

    nodes = [];
    for (var i = 0; i < totalNodeCount; i++) {
        nodes.push(new Node(random(width), random(height)));
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    while (nodes.length < totalNodeCount) {
        nodes.push(new Node(random(width), random(height)));
    }
    if (nodes.length > totalNodeCount) {
        var amountOver = nodes.length - totalNodeCount;
        nodes.splice(-amountOver, amountOver);
    }
    background(51);
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].update();
    }

    // Check each nodes' neighbours, only one way edges to be quicker to run
    for (var i = 0; i < nodes.length - 1; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
            var a = nodes[i];
            var b = nodes[j];

            if (dist(a.x, a.y, b.x, b.y) < distanceToConnect) {
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

        if (showDistance) {
            stroke(255, 0, 0, 127);
            noFill();
            ellipse(this.x, this.y, 2 * distanceToConnect);
        }
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
