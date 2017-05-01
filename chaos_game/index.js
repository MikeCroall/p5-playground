// Originally created by Mike Croall https://github.com/MikeCroall/p5-playground

// function windowResized() {
//     resizeCanvas(windowWidth, windowHeight);
// }

alert("Click to place corners - 3 minimum\n\nCurrent point will choose a random corner, and move halfway towards it, draw itself, and repeat");

var corners = [];
var currentPoint;
var points = 1;

var pointCountDiv;

function setup() {
    createCanvas(windowWidth, windowHeight);

    currentPoint = {
        x: random(width),
        y: random(height)
    };
    fill(255);
    ellipse(currentPoint.x, currentPoint.y, 3, 3);

    pointCountDiv = select("#lblPoints");
    pointCountDiv.html("Points: " + points);
}

function mouseClicked() {
    corners.push({
        x: mouseX,
        y: mouseY
    });
    background(51);

    noStroke();
    fill(255);
    ellipse(currentPoint.x, currentPoint.y, 3, 3);
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
    points ++;


    pointCountDiv.html("Points: " + points);
}

function moveHalfwayTo(movingPoint, point) {
    movingPoint.x = (movingPoint.x + point.x) / 2;
    movingPoint.y = (movingPoint.y + point.y) / 2;
    // TODO link division to amount of corners or a slider? More able to find patterns if can change
}
