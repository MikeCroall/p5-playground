let fps = 25;
let FRAMES_PER_ITERATION = 25;
let MAXIMUM_BRANCH_DEPTH = 14;
let split_amount = 2;
let length_multiplier = 3 / 4;
let mainBranch = undefined;

let captureVideoFrames = false;
const MAXIMUM_CAPTURE_FRAME_COUNT = 751; // 205=8.2 seconds@25fps 750=30 seconds@25fps

let capturer;
if (captureVideoFrames) {
    capturer = new CCapture({ format: 'png', framerate: 25, name: 'branchingvid', verbose: true });
}
let canv;

function windowResized() {
    if (!captureVideoFrames) {
        resizeCanvas(windowWidth, windowHeight);
        background(0);
        mainBranch = undefined;
    }
}

function setup() {
    let p5canvas;

    generateControlsGui();

    if (captureVideoFrames) {
        p5canvas = createCanvas(1920, 1080);
    } else {
        p5canvas = createCanvas(windowWidth, windowHeight);
    }

    canv = p5canvas.canvas;
    frameRate(fps);

    if (captureVideoFrames) {
        capturer.start();
    }
}

function draw() {
    if (frameCount === 1) {
        background(0);
    }
    if (frameCount % FRAMES_PER_ITERATION === 0) {
        if (!mainBranch) {
            mainBranch = new Branch(width / 2, height, 0, height / 4, 1);
        } else {
            mainBranch.branchOut(MAXIMUM_BRANCH_DEPTH, split_amount, length_multiplier);
        }
        background(0);
        stroke(255);
        strokeWeight(2);
        mainBranch.draw();
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

function generateControlsGui() {
    let divButtons = createDiv("Controls");
    divButtons.position(0, 0);
    divButtons.id("divButtons");
    divButtons.style("color", "#fff");

    let lblSplitAmount = createSpan("Splits: " + split_amount);
    lblSplitAmount.parent("divButtons");
    lblSplitAmount.style("display", "block");

    let lblMaxBranchDepth = createSpan("Max Branch Depth: " + MAXIMUM_BRANCH_DEPTH);
    lblMaxBranchDepth.parent("divButtons");
    lblMaxBranchDepth.style("display", "block");

    let btnLessSplits = createButton("Fewer Splits Per Branch (and reset)");
    btnLessSplits.parent("divButtons");
    btnLessSplits.style("display", "block");
    btnLessSplits.mousePressed(function() {
        split_amount = max(1, split_amount - 1);
        lblSplitAmount.html("Splits: " + split_amount);
        mainBranch = undefined;
        background(0);
    });

    let btnMoreSplits = createButton("More Splits Per Branch (and reset)");
    btnMoreSplits.parent("divButtons");
    btnMoreSplits.style("display", "block");
    btnMoreSplits.mousePressed(function() {
        split_amount = min(10, split_amount + 1);
        lblSplitAmount.html("Splits: " + split_amount);
        mainBranch = undefined;
        background(0);
    });

    let btnDeeper = createButton("Increase Maximum Branch Depth");
    btnDeeper.parent("divButtons");
    btnDeeper.style("display", "block");
    btnDeeper.mousePressed(function() {
        MAXIMUM_BRANCH_DEPTH = min(16, MAXIMUM_BRANCH_DEPTH + 1);
        lblMaxBranchDepth.html("Max Branch Depth: " + MAXIMUM_BRANCH_DEPTH);
        // mainBranch = undefined;
        // background(0);
    });

    let btnShallower = createButton("Decrease Maximum Branch Depth (and reset)");
    btnShallower.parent("divButtons");
    btnShallower.style("display", "block");
    btnShallower.mousePressed(function() {
        MAXIMUM_BRANCH_DEPTH = max(2, MAXIMUM_BRANCH_DEPTH - 1);
        lblMaxBranchDepth.html("Max Branch Depth: " + MAXIMUM_BRANCH_DEPTH);
        mainBranch = undefined;
        background(0);
    });
}