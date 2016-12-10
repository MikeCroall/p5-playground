// Docs: https://p5js.org/reference/

// final
var MAX_SPEED = 10;
var INITIAL_BALL_SPAWNS = 10;
var FRICTION = true;
var FRICTION_MULTIPLIER = 0.999;

// changing
var balls = [];
var averageSpeed = 0;

function setup() {
	frameRate(30);
	createCanvas(1300, 731);
	for (var i = INITIAL_BALL_SPAWNS - 1; i >= 0; i--) {
		balls.push(new ball());
	}
}

function draw() {
	background(51);

	averageSpeed = 0;
 	for (var i = balls.length - 1; i >= 0; i--) {
 		balls[i].update();
 		balls[i].draw();
 		averageSpeed += sqrt(sq(balls[i].xspeed) + sq(balls[i].yspeed))
 	}
 	averageSpeed /= balls.length;

 	noStroke();
 	textSize(32);
	fill(color(255, 255, 255));
	text("Average speed: " + averageSpeed.toFixed(4), 10, height - 10);
}

function ball() {

	// final
	this.r = random(5, 50);
	this.colour = color(random(100,255), random(100, 255), random(100, 255), 127);

	// changing
	this.x = random(this.r, width - this.r);
	this.y = random(this.r, height - this.r);

	this.xspeed = random(-1 * MAX_SPEED, MAX_SPEED);
	this.yspeed = random(-1 * MAX_SPEED, MAX_SPEED);

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

			if (FRICTION) {
				this.xspeed *= FRICTION_MULTIPLIER; // slow down horizontally
				this.yspeed *= FRICTION_MULTIPLIER; // slow down vertically

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