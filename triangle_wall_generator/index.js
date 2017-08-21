// Originally created by Mike Croall https://github.com/MikeCroall/p5-playground

// For reference with p5.js, look to https://p5js.org/reference/
// Using p5.js library, we can define setup to be run first, and only once, then draw, which can run continually at some frame rate
// The shapes used are triangle(..) which takes 6 arguments (x1, y1, x2, y2, x3, y3), and rect(..) which takes 4 arguments (x, y, width, height)

// Options
var resolutionX = 720,
    resolutionY = 720,
    trianglesHorizontally = 10,
    trianglesVertically = 10,
    triangleColours = [ // NOTE play with colours, add some, remove some, any amount will work, in form [R, G, B], all 0 to 255
        [255, 0, 0],
        [255, 127, 0],
        [255, 255, 0],
        [0, 0, 0]
    ],
    blackOverlay = false, // NOTE play with these overlays for 'muted' colours
    whiteOverlay = false;
    // TODO perhaps a texture overlay to match the target style image?

// Determined by options
var triangleVerticalSide = resolutionY / trianglesVertically,
    triangleHorizontalSide = resolutionX / trianglesHorizontally;

function setup() {
    createCanvas(resolutionX, resolutionY);

    // Background fills the entire canvas with a colour in RGB eg. background(255, 127, 0); giving only one argument means R = G = B
    background(0);

    // Don't outline shapes (can use stroke(colour) as with fill(..) and background(..))
    // NOTE If changing this to stroke(colour values..), also play with strokeWeight(n) where n is the width of the outline
    noStroke();

    // NOTE in p5.js, the origin (0, 0) is the top left corner
    for (var y = 0; y < resolutionY / trianglesVertically; y++) {
        for (var x = 0; x < resolutionX / trianglesHorizontally; x++) {
            drawTriangles(x, y);
        }
    }

    // For muted colours (the 4th argument to fill is an alpha value, for transparency, still between 0 and 255)
    if (blackOverlay) {
        fill(0, 0, 0, 127);
        rect(0, 0, resolutionX, resolutionY);
    }
    if (whiteOverlay) {
        fill(255, 255, 255, 127);
        rect(0, 0, resolutionX, resolutionY);
    }
}

function drawTriangles(x, y) {
    // NOTE play with stylistic choices such as keeping one quarter of the square black, etc.
    // Triangles to be drawn in relation to the current square
    var squareTopLeftX = x * triangleHorizontalSide,
        squareTopLeftY = y * triangleVerticalSide;

    // Top Right of square, coordinates of triangle are a, b, and c
    var ax = squareTopLeftX,
        ay = squareTopLeftY,
        bx = squareTopLeftX + triangleHorizontalSide,
        by = squareTopLeftY,
        cx = squareTopLeftX + triangleHorizontalSide,
        cy = squareTopLeftY + triangleVerticalSide;

    // Use p5.js random(..) to choose a fill colour
    var col = random(triangleColours);
    fill(col[0], col[1], col[2]);
    triangle(ax, ay, bx, by, cx, cy);

    // Bottom Left of square, redefine but don't redeclare above coordinates and colour
    ax = squareTopLeftX,
    ay = squareTopLeftY,
    bx = squareTopLeftX,
    by = squareTopLeftY + triangleVerticalSide,
    cx = squareTopLeftX + triangleHorizontalSide,
    cy = squareTopLeftY + triangleVerticalSide;

    // Use p5.js random(..) to choose a fill colour
    col = random(triangleColours);
    fill(col[0], col[1], col[2]);
    triangle(ax, ay, bx, by, cx, cy);
}

function saveCanvasToFile() {
    // Use p5.js method (much easier than writing this ourselves)
    saveCanvas("triangles", "png");
}

function draw() {
    // NOTE could be used to animate the steps of generation, but as a simple tool rather than a visual this isn't needed
}
