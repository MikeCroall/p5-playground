let fps = 25;
let INITIAL_ITERATIONS_PER_FRAME = 100;
let iterationsPerFrame = INITIAL_ITERATIONS_PER_FRAME;
let currentPoint;

let captureVideoFrames = false;
const MAXIMUM_CAPTURE_FRAME_COUNT = 751; // 205=8.2 seconds@25fps 750=30 seconds@25fps

let capturer;
if (captureVideoFrames) {
    capturer = new CCapture({ format: 'png', framerate: 25, name: 'fernvid', verbose: true });
}
let canv;

function windowResized() {
    if (!captureVideoFrames) {
        resizeCanvas(windowWidth, windowHeight);
        background(0);
        iterationsPerFrame = INITIAL_ITERATIONS_PER_FRAME;
    }
}

function setup() {
    let p5canvas;

    if (captureVideoFrames) {
        p5canvas = createCanvas(1920, 1080);
    } else {
        p5canvas = createCanvas(windowWidth, windowHeight);
    }

    canv = p5canvas.canvas;
    frameRate(fps);

    currentPoint = createVector(0, 0);

    if (captureVideoFrames) {
        capturer.start();
    }
}

function draw() {
    if (frameCount == 1) {
        background(0);
    }
    translate(width / 2, 0);
    strokeWeight(1);
    stroke(30, 255, 30);

    for (var i = 0; i < iterationsPerFrame; i++) {
        currentPoint = getNextPoint(currentPoint);
        plot(currentPoint);
    }
    if (iterationsPerFrame < 10000) {
        iterationsPerFrame *= 1.05;
    }


    if (captureVideoFrames) {
        capturer.capture(canv);
        if (frameCount == MAXIMUM_CAPTURE_FRAME_COUNT) {
            noLoop();
            capturer.stop();
            capturer.save();
        }
    }
}

function plot(p) {
    let maxDimension = min(width, height);
    // Standard range produced is −2.1820 < x < 2.6558 and 0 ≤ y < 9.9983
    point(
        map(p.x, -2.1820, 2.6558, -maxDimension / 2, maxDimension / 2),
        map(p.y, 0, 9.9983, maxDimension, 0)
    );
}

function getNextPoint(p) {
    let n = createVector();
    let r = random(1);
    /*
    ƒ1	0	    0	    0	    0.16	0	0	    0.01	Stem
    ƒ2	0.85	0.04	−0.04	0.85	0	1.60	0.85	Successively smaller leaflets
    ƒ3	0.20	−0.26	0.23	0.22	0	1.60	0.07	Largest left-hand leaflet
    ƒ4	−0.15	0.28	0.26	0.24	0	0.44	0.07	Largest right-hand leaflet
    */

    if (r < 0.01) { // Stem
        n.x = 0;
        n.y = 0.16 * p.y;

    } else if (r < 0.86) { // Successively smaller leaflets
        n.x =  0.85 * p.x + 0.04 * p.y;
        n.y = -0.04 * p.x + 0.85 * p.y + 1.60;

    } else if (r < 0.93) { // Largest left-hand leaflet
        n.x = 0.20 * p.x + -0.26 * p.y;
        n.y = 0.23 * p.x +  0.22 * p.y + 1.60;

    } else { // Largest right-hand leaflet
        n.x = -0.15 * p.x + 0.28 * p.y;
        n.y =  0.26 * p.x + 0.24 * p.y + 0.44;
    }

    return n;
}
