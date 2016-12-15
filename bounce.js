// Docs: https://p5js.org/reference/

// final
var MAX_SPEED_AT_SPAWN_IN_ONE_DIRECTION = 5;
var INITIAL_BALL_SPAWNS = 10;

// changing
var showStats = true;
var friction = false;
var trails = false;
var frictionAmount = 0.0;
var balls = [];
var gui;

function setup() {
	frameRate(60);
	createCanvas(windowWidth, windowHeight);
    
    sliderRange(-0.005, 0.05, 0.001);
    gui = createGui('Settings');
    gui.addGlobals('showStats', 'trails', 'friction', 'frictionAmount');
    
	for (var i = INITIAL_BALL_SPAWNS - 1; i >= 0; i--) {
		balls.push(new ball());
	}
    console.log("setup complete");
}

function draw() {
    console.log("drawing");
    if (trails) {
	   background(51, 60);
    } else {
        background(51);
    }

    for (var i = balls.length - 1; i >= 0; i--) {            
        balls[i].update();
        balls[i].draw();
    }
    
    if (showStats) {
        var averageSpeed = 0;
        var maxSpeed = 0;
        var minSpeed = Number.MAX_SAFE_INTEGER;
        
        for (var i = balls.length - 1; i >= 0; i--) {            
            var speed = sqrt(sq(balls[i].xspeed) + sq(balls[i].yspeed));
            averageSpeed += speed;
            if (maxSpeed < speed) { maxSpeed = speed; }
            if (minSpeed > speed) { minSpeed = speed; }
        }
        averageSpeed /= balls.length;
        
        noStroke();
        textSize(32);
        var fps = floor(frameRate());
        if (fps > 60){
            fps = 60;
        }
        fill(color(map(fps, 0, 60, 255, 0), map(fps, 0, 60, 0, 255), 0));
        text("FPS: " + fps, 10, height - 130);
        fill(255);
        text("Max speed: " + maxSpeed.toFixed(4), 10, height - 90);
        text("Average speed: " + averageSpeed.toFixed(4), 10, height - 50);
        text("Min speed: " + minSpeed.toFixed(4), 10, height - 10);
    }
}

function ball() {

	// final
	this.r = random(5, 50);
	this.colour = color(random(130,255), random(130, 255), random(130, 255), 127);

	// changing
	this.x = random(this.r, width - this.r);
	this.y = random(this.r, height - this.r);

	this.xspeed = random(-1 * MAX_SPEED_AT_SPAWN_IN_ONE_DIRECTION, MAX_SPEED_AT_SPAWN_IN_ONE_DIRECTION);
	this.yspeed = random(-1 * MAX_SPEED_AT_SPAWN_IN_ONE_DIRECTION, MAX_SPEED_AT_SPAWN_IN_ONE_DIRECTION);

	this.alive = true;

	this.stop = function() {
		this.xspeed = 0;
		this.yspeed = 0;
	}

	this.update = function() {
		if (this.alive) {
			this.x += this.xspeed; // move horizontally
			this.y += this.yspeed; // move vertically

			if (this.x - this.r < 0 || this.x + this.r > width) { // bounce off walls horizontally
				this.xspeed *= -1;
			}

			if (this.y - this.r < 0 || this.y + this.r > height) { // bounce off walls vertically
				this.yspeed *= -1;
			}

			if (friction) {
				this.xspeed *= 1 - frictionAmount; // slow down horizontally
				this.yspeed *= 1 - frictionAmount; // slow down vertically

				if (abs(this.xspeed) < 0.05) { // die faster
					this.xspeed = 0;
				}
				if (abs(this.yspeed) < 0.05) { // die faster
					this.yspeed = 0;
				}
			
				if (this.xspeed === 0 && this.yspeed === 0) { // really dead check
					this.alive = false;
					this.colour = color(255, 0, 0, 50);
				}
			}
		}
	}

	this.draw = function() {
		if (this.alive) {
			noStroke();
		} else {
			stroke(color(255, 0, 0));
			strokeWeight(1);
		}
		fill(this.colour);
		ellipse(this.x, this.y, 2 * this.r);
	}
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}