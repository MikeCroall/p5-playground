let noiseScale = 0.06;
let viewScale = 20;
let noiseMax = 160;
let rows = 90;
let columns = 160;
let heights = [];

let captureVideoFrames = false;
const MAXIMUM_VIDEO_FRAME_COUNT = 2500;
let capturer;
if (captureVideoFrames) {
    capturer = new CCapture({ format: 'png', framerate: 25, name: 'perlinlandscapevid', verbose: true });
}
let canv;

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function setup() {
    let p5canvas;
    if (captureVideoFrames) {
        p5canvas = createCanvas(1920, 1080, WEBGL);
    } else {
        p5canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    }
    canv = p5canvas.canvas;
    frameRate(25);

    if (captureVideoFrames) {
        capturer.start();
    }
}

function draw() {
    // Animate flying before drawing
    let yOffset = -frameCount / 10;
    for (var y = 0; y < rows; y++) {
        heights[y] = [];
        for (var x = 0; x < columns; x++) {
            heights[y][x] = map(noise(x * noiseScale, yOffset), 0, 1, -noiseMax, noiseMax);
        }
        yOffset += noiseScale;
    }

    background(0);
    rotateX(PI / 2.6);
    translate(- 3 * width / 4, -height / 2);

    stroke(255);
    fill(0);
    strokeWeight(2);

    for (var y = 0; y < rows - 1; y++) {
        beginShape(TRIANGLE_STRIP); // TODO FIXME why is TRIANGLE_STRIP drawing quads?
        for (var x = 0; x < columns; x++) {
            vertex(x * viewScale, y * viewScale, heights[y][x]);
            vertex(x * viewScale, (y + 1) * viewScale, heights[y + 1][x]);
        }
        endShape();
    }

    if (captureVideoFrames) {
        capturer.capture(canv);
    }

    if (captureVideoFrames && frameCount == MAXIMUM_VIDEO_FRAME_COUNT) {
        noLoop();
        capturer.stop();
        capturer.save();
    }
}
