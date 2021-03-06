const MAXIMUM_ITERATION_DEPTH = 6;  // NOTE every 1 iteration further is MUCH more processing per frame
let currentIterationLimit = 1;  // for animating iterations, instead of jumping straight in at the deep end
let framesPerIteration = 25;
let iterationZeroSideLength;
let carpetStartX, carpetStartY;
let scaleFactor = 1;

let captureVideoFrames = false;
const MAXIMUM_CAPTURE_FRAME_COUNT = 206; // 205=8.2 seconds@25fps 750=30 seconds@25fps

let capturer;
if (captureVideoFrames) {
    capturer = new CCapture({ format: 'png', framerate: 25, name: 'sierpvid', verbose: true });
}
let canv;

function findInitialSideLengthAndPosition() {
    iterationZeroSideLength = min(width, height); // to scale down and keep centered, * (x where 0 < x < 1) here (may not zoom cleanly if not full height or width)
    carpetStartX = (width - iterationZeroSideLength) / 2;
    carpetStartY = (height - iterationZeroSideLength) / 2;
}

function windowResized() {
    if (!captureVideoFrames) {
        let squareCanvasSize = min(windowWidth, windowHeight);
        resizeCanvas(squareCanvasSize, squareCanvasSize, true);
        findInitialSideLengthAndPosition();
        redraw();
    }
}

function setup() {
    let p5canvas;
    let squareCanvasSize = min(windowWidth, windowHeight);

    if (captureVideoFrames) {
        squareCanvasSize = 1080; // min(1920, 1080)
    }
    p5canvas = createCanvas(squareCanvasSize, squareCanvasSize);
    canv = p5canvas.canvas;
    frameRate(framesPerIteration);

    findInitialSideLengthAndPosition();

    if (captureVideoFrames) {
        capturer.start();
    }
}

function draw() {
    /*
    In theory, could draw background once, and only ever add NEW black squares on top
    In practice, this was reducing the quality of the output - it appears as though p5.js is
                storing a lower quality version of the canvas image to draw onto. The edges of
                squares become quite jagged. Drawing everything fresh each time however is clean.
    */
    background(0);
    if (currentIterationLimit >= MAXIMUM_ITERATION_DEPTH) {
        scaleFactor *= 1.004;
        if (scaleFactor >= 3) {
            scaleFactor /= 3;
        }
    }
    translate(carpetStartX, carpetStartY);

    noStroke();
    fill(255);
    rect(0, 0, iterationZeroSideLength * scaleFactor, iterationZeroSideLength * scaleFactor);

    fill(0);  // match background to 'take away' from the shape
    drawSquare(0, 0, 1, iterationZeroSideLength / 3);

    if (currentIterationLimit < MAXIMUM_ITERATION_DEPTH && frameCount % framesPerIteration == 0) {
        currentIterationLimit++;
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

function drawSquare(x, y, iter, sideLength) {
    // x and y are the top left corner of this square
    rect((x + sideLength) * scaleFactor, (y + sideLength) * scaleFactor, sideLength * scaleFactor, sideLength * scaleFactor);
    if (iter < currentIterationLimit) {
        let subSideLength = sideLength / 3;
        let newIter = iter + 1;
        drawSquare(x,                  y,                  newIter, subSideLength); /* upper left    */
        drawSquare(x + sideLength,     y,                  newIter, subSideLength); /* upper middle  */
        drawSquare(x + 2 * sideLength, y,                  newIter, subSideLength); /* upper right   */
        drawSquare(x,                  y + sideLength,     newIter, subSideLength); /* middle left   */
        drawSquare(x + 2 * sideLength, y + sideLength,     newIter, subSideLength); /* middle right  */
        drawSquare(x,                  y + 2 * sideLength, newIter, subSideLength); /* bottom left   */
        drawSquare(x + sideLength,     y + 2 * sideLength, newIter, subSideLength); /* bottom middle */
        drawSquare(x + 2 * sideLength, y + 2 * sideLength, newIter, subSideLength); /* bottom right  */
    } /* if only drawing NEW squares, move the rect() call to an else block here */
}
