let n = 5; // 2^n + 1 will be the side length of the map
let heightmap = [];
let framesPerIteration = 100;
let scaleFactor = 40;
let diamondSquareSize;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    // frameRate(2);

    // create heightmap
    for (var i = 0; i < Math.pow(2, n) + 1; i++) {
        let row = [];
        for (var j = 0; j < Math.pow(2, n) + 1; j++) {
            row[j] = 0;
        }
        heightmap[i] = row;
    }
    // initialise corners with seed values
    heightmap[0][0] = 23;
    heightmap[0][heightmap.length - 1] = 8;
    heightmap[heightmap.length - 1][0] = 23;
    heightmap[heightmap.length - 1][heightmap.length - 1] = -3;
    // prepare for diamond square algorithm
    diamondSquareSize = floor(heightmap.length / 2);
}

function draw() {
    background(0);
    camera(-300 * n, 650, -300 * n,
        scaleFactor * heightmap.length / 2,
        0,
        scaleFactor * heightmap.length / 2,
        0, -1, 0);
    rotateY(frameCount / 400);

    scale(scaleFactor);

    fill(0);
    stroke(255);
    strokeWeight(3);
    for (var x = 0; x < heightmap.length - 1; x++) {
        for (var z = 0; z < heightmap.length - 1; z++) {
            let drawX = x - heightmap.length / 2;
            let drawZ = z - heightmap.length / 2;
            beginShape();
            vertex(drawX, heightmap[x][z], drawZ);
            vertex(drawX + 1, heightmap[x + 1][z], drawZ);
            vertex(drawX + 1, heightmap[x + 1][z + 1], drawZ + 1);
            vertex(drawX, heightmap[x][z + 1], drawZ + 1);
            endShape(CLOSE);
        }
    }

    if (frameCount % framesPerIteration == 0) {
        squareDiamond();
    }
}

function squareDiamond() {
    let half = floor(diamondSquareSize / 2);
    if (half < 1) {
        return;
    }

    // square
    for (var z = half; z < heightmap.length; z += diamondSquareSize) {
        for (var x = half; x < heightmap.length; x += diamondSquareSize) {
            squareStep(x % heightmap.length, z % heightmap.length, half);
        }
    }

    // diamond
    let col = 0;
    for (var x = 0; x < heightmap.length; x += half) {
        col++;
        for (var z = col % 2 == 1 ? half : 0; z < heightmap.length; z += diamondSquareSize) {
            diamondStep(x % heightmap.length, z % heightmap.length, half);
        }
    }

    diamondSquareSize = half;
}

function squareStep(x, z, radius) {
    let count = 0;
    let avg = 0;

    if (x - radius >= 0 && z - radius >= 0) {
        avg += heightmap[x - radius][z - radius];
        count++;
    }
    if (x - radius >= 0 && z + radius < heightmap.length) {
        avg += heightmap[x - radius][z + radius];
        count++;
    }
    if (x + radius < heightmap.length && z - radius >= 0) {
        avg += heightmap[x + radius][z - radius];
        count++;
    }
    if (x + radius < heightmap.length && z + radius < heightmap.length) {
        avg += heightmap[x + radius][z + radius];
        count++;
    }

    avg += random(radius);
    avg /= count;
    heightmap[x][z] = avg;
}

function diamondStep(x, z, radius) {
    let count = 0;
    let avg = 0;

    if (x - radius >= 0) {
        avg += heightmap[x - radius][z];
        count++;
    }
    if (x + radius < heightmap.length) {
        avg += heightmap[x + radius][z];
        count++;
    }
    if (z - radius >= 0) {
        avg += heightmap[x][z - radius];
        count++;
    }
    if (z + radius < heightmap.length) {
        avg += heightmap[x][z + radius];
        count++;
    }

    avg += random(radius);
    avg /= count;
    heightmap[x][z] = avg;
}