let settingsGui;
var framesPerIteration = 30;
var maximumIterationDepth = 6;
var zoomAmount = 1.0;
var zoomSpeed = 0.01;
var zoomLimit = 16000;
var zoomAccel = function () {
    return 0;
};
var zoom = true;
var fade = false;
var culling = true;

let currentIteration = 0;
let sections;
let translateX = undefined, translateY = undefined, offsetForCorner = undefined;
let viableToIncreaseMaxIterDepthIfCountDrops = false;
let tooManySections = 2500;

function getZoomAccel(zoom) {
    return 0.001 * sqrt(zoom);
}

function setup() {
    frameRate(30);
    createCanvas(windowWidth, windowHeight);

    // settingsGui = createGui("Settings");
    // settingsGui.setPosition(10, 10);
    // sliderRange(3, 200, 1);
    // settingsGui.addGlobals("framesPerIteration");
    // sliderRange(1, 15, 1);
    // settingsGui.addGlobals("maximumIterationDepth");
    // settingsGui.addGlobals("zoom", "fade", "culling");

    sections = [];
    // Initial triangle dynamic to window size
    let initialLength = min(width, height) * 0.65;
    // h being the full height of the initial triangle - the full snowflake is 4h/3 tall
    let h = initialLength * sin(PI/3);
    // centerY such that overall snowflake remains centered (not just window center)
    let centerY = ((height - (4 * h / 3)) / 2) + (2 * h / 3);
    let middleX = width / 2;
    translateX = middleX; middleX = 0;
    translateY = centerY; centerY = 0;
    offsetForCorner = 2 * h / 3;
    let topY = centerY - (initialLength / sqrt(3));

    let top = createVector(middleX, topY);
    let bottomLeft = createVector(middleX - (initialLength / 2), topY + h);
    let bottomRight = createVector(middleX + (initialLength / 2), topY + h);

    sections.push(new Line(bottomRight, bottomLeft));
    sections.push(new Line(bottomLeft, top));
    sections.push(new Line(top, bottomRight));
}

function draw() {
    if (fade) {
        background(0, 50);
    } else {
        background(0);
    }

    if (sections.length < tooManySections && currentIteration >= maximumIterationDepth) {
        maximumIterationDepth++;
    }

    // Do the splits
    if (frameCount % framesPerIteration == 0 && currentIteration < maximumIterationDepth) {
        currentIteration++;
        let newSections = [];
        for(let sec of sections) {
            newSections.push(...sec.split());
        }
        sections = newSections;
        console.log("Post iteration section count: ", sections.length);
    } else if (frameCount % 30 == 0) {
        console.log("Culling-check section count: ", sections.length);
    }

    // Draw everything
    let actualTranslatedY = translateY;
    if (translateX !== undefined && translateY !== undefined && offsetForCorner !== undefined) {
        if (zoomAmount > 1 && zoomAmount < 2) {
            actualTranslatedY = translateY - (offsetForCorner * zoomAmount)*(zoomAmount-1);
        } else if (zoomAmount >= 2) {
            actualTranslatedY = translateY - (offsetForCorner * zoomAmount);
            zoomAccel = getZoomAccel;
        }
        translate(translateX, actualTranslatedY);
    }
    strokeWeight(1);
    stroke(255);
    for (var i = sections.length - 1; i >= 0; i--) {
        // Check if on-screen - if it is, draw, if not, remove
        if (culling && sections[i].outOfBounds(-translateX, translateX, -actualTranslatedY, zoomAmount)) {
            sections.splice(i, 1);
        } else {
            sections[i].draw(zoomAmount);
        }
    }

    if (zoom && currentIteration > 1) {
        zoomAmount += zoomSpeed;
        if (zoomAmount >= zoomLimit) {
            zoom = false;
            alert("Due to limitations of floating point precision, we're going to stop zooming there...")
        }
        zoomSpeed += zoomAccel(zoomAmount);
    }
}

class Line {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    split() {
        let parts = [];
        let third = p5.Vector.sub(this.end, this.start).div(3);
        let oneThirdAlong = p5.Vector.add(this.start, third);
        let twoThirdsAlong = p5.Vector.sub(this.end, third);

        // _/\_ first part
        parts.push(new Line(this.start, oneThirdAlong));

        // _/\_ find that point between second and third part to add them
        third.rotate(-PI/3);
        let thatPoint = p5.Vector.add(oneThirdAlong, third);
        parts.push(new Line(oneThirdAlong, thatPoint));
        parts.push(new Line(thatPoint, twoThirdsAlong));

        // _/\_ last part
        parts.push(new Line(twoThirdsAlong, this.end));

        return parts;
    }

    draw(scaling) {
        line(this.start.x * scaling, this.start.y * scaling, this.end.x * scaling, this.end.y * scaling);
    }

    outOfBounds(lx, rx, ty, scaling) {
        let scaledStart = this.start.copy().mult(scaling);
        let scaledEnd = this.end.copy().mult(scaling);
        let startOut = scaledStart.x < lx || scaledStart.x > rx || scaledStart.y < ty;
        let endOut = scaledEnd.x < lx || scaledEnd.x > rx || scaledEnd.y < ty;
        return startOut && endOut;
    }
}
