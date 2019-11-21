let settingsGui;
var framesPerIteration = 30;
var maximumIterationDepth = 6;
var zoom = 1.0;
var zoomOnCorner = false;
var fade = true;

let currentIteration = 0;
let sections;
let translateX = undefined, translateY = undefined, offsetForCorner = undefined;

function setup() {
    frameRate(30);
    createCanvas(windowWidth, windowHeight);

    settingsGui = createGui("Settings");
    settingsGui.setPosition(10, 10);
    sliderRange(3, 200, 1);
    settingsGui.addGlobals("framesPerIteration");
    sliderRange(1, 8, 1);
    settingsGui.addGlobals("maximumIterationDepth");
    sliderRange(1, 20, 0.001);
    settingsGui.addGlobals("zoom", "zoomOnCorner", "fade");

    // Initial triangle dynamic to window size
    sections = [];

    let initialLength = min(width, height) * 0.65;
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

    // Do the splits
    if (frameCount % framesPerIteration == 0 && maximumIterationDepth > currentIteration) {
        currentIteration++;
        let newSections = [];
        for(let sec of sections) {
            newSections.push(...sec.split())
        }
        sections = newSections;
        if (currentIteration >= maximumIterationDepth) {
            console.log("Maximum iteration depth reached - no more iterations will occur")
        }
    }

    // Draw everything
    if (translateX !== undefined && translateY !== undefined && offsetForCorner !== undefined) {
        if (zoomOnCorner) {
            translate(translateX, translateY - (offsetForCorner * zoom));
        } else {
            translate(translateX, translateY);
        }
    }
    scale(zoom);
    strokeWeight(1);
    stroke(255);
    for (let sec of sections) {
        sec.draw();
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

    draw() {
        line(this.start.x, this.start.y, this.end.x, this.end.y);
    }
}
