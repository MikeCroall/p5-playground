let settingsGui;
var framesPerIteration = 30;
var maximumIterationDepth = 6;
var zoomAmount = 1.0;
var zoomSpeed = 0.01;
var zoom = true;
var fade = false;
var culling = false;

let currentIteration = 0;
let sections;
let translateX = undefined, translateY = undefined, offsetForCorner = undefined;

function setup() {
    frameRate(30);
    createCanvas(windowWidth, windowHeight);

    settingsGui = createGui("Settings");
    settingsGui.setPosition(10, 10);
    // sliderRange(3, 200, 1);
    // settingsGui.addGlobals("framesPerIteration");
    sliderRange(1, 8, 1);
    settingsGui.addGlobals("maximumIterationDepth");
    sliderRange(0.0001, 0.5, 0.0001);
    settingsGui.addGlobals("zoomSpeed");
    settingsGui.addGlobals("zoom", "fade");//, "culling");

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
            if (!(culling && sec.markedForDeath)) {
                newSections.push(...sec.split());
            }
        }
        sections = newSections;
        console.log("Post iteration section count: ", sections.length);
        if (currentIteration >= maximumIterationDepth) {
            console.log("Maximum iteration depth reached - no more iterations will occur");
        }
    }

    // Draw everything
    if (translateX !== undefined && translateY !== undefined && offsetForCorner !== undefined) {
        if (zoomAmount > 1 && zoomAmount < 2) {
            translate(translateX, translateY - (offsetForCorner * zoomAmount)*(zoomAmount-1));
        } else if (zoomAmount >= 2){
            translate(translateX, translateY - (offsetForCorner * zoomAmount));
        } else {
            translate(translateX, translateY);
        }
    }
    // scale(zoomAmount);
    strokeWeight(1);
    stroke(255);
    for (let sec of sections) {
        sec.draw(zoomAmount);
    }

    if (zoom && currentIteration > 1) {
        zoomAmount += zoomSpeed;
    } else {
        zoomAmount = 1;
    }
}

class Line {
    constructor(start, end) {
        this.start = start;
        this.end = end;
        this.markedForDeath = false;
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
}
