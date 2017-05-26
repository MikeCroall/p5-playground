// Originally created by Mike Croall https://github.com/MikeCroall/p5-playground

// function windowResized() {
//     resizeCanvas(windowWidth, windowHeight);
// }

alert("Click to place corners - 3 minimum\n\nCurrent point will choose a random corner, and move a fraction towards it, draw itself, and repeat");

var corners = [];
var currentPoint;
var points = 1;
var ratioSlider;
var lastRatioValue = 0.5;

var pointCountDiv;
var ratioDiv;

function setup() {
    createCanvas(windowWidth * 0.9, windowHeight * 0.9);

    currentPoint = {
        x: random(width),
        y: random(height)
    };
    fill(255);
    ellipse(currentPoint.x, currentPoint.y, 3, 3);

    pointCountDiv = select("#lblPoints");
    pointCountDiv.html("Points: " + points);
    ratioDiv = select("#lblRatio");
    ratioDiv.html("Move distance ratio: " + lastRatioValue);

    ratioSlider = createSlider(0, 1, lastRatioValue, 0.025);
    ratioSlider.position(20, 40);
}

function mouseClicked() {
    if (mouseX >= 0 && mouseY >= 0 && (mouseX > 100 || mouseY > 50)) {
        corners.push({
            x: mouseX,
            y: mouseY
        });
        background(51);

        noStroke();
        fill(255);
        ellipse(currentPoint.x, currentPoint.y, 3, 3);
    }
}

function draw() {
    for (var i = 0; i < corners.length; i++) {
        fill(0, 255, 0);
        ellipse(corners[i].x, corners[i].y, 6, 6);
    }

    if (corners.length < 3) {
        return;
    }

    var nextChoice = random(corners);
    moveHalfwayTo(currentPoint, nextChoice);
    fill(255);
    ellipse(currentPoint.x, currentPoint.y, 3, 3);
    points++;


    pointCountDiv.html("Points: " + points);
}

function moveHalfwayTo(movingPoint, point) {

    var sliderValue = ratioSlider.value();
    if (sliderValue != lastRatioValue) {
        background(51);
        // Clear non-corners when ratio changes
    }
    lastRatioValue = sliderValue;
    ratioDiv.html("Move distance ratio: " + sliderValue);

    movingPoint.x = (movingPoint.x + point.x) * sliderValue;
    movingPoint.y = (movingPoint.y + point.y) * sliderValue;
}
