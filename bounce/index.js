// Originally created by Mike Croall https://github.com/MikeCroall/p5-playground

// final
var MAX_SPEED_AT_SPAWN_IN_ONE_DIRECTION = 50;
var INITIAL_BALL_SPAWNS = 40;

// Matter.js aliases
var World = Matter.World,
    Engine = Matter.Engine,
    Events = Matter.Events,
    Bodies = Matter.Bodies;

// Matter.js instances
var engine,
    world,
    bounds = [],
    balls = [];

// changing
var showStats = true;
var trails = false;

function setup() {
    frameRate(60);
    createCanvas(windowWidth, windowHeight);

    engine = Engine.create();
    world = engine.world;
    world.gravity.y = 0;

    Events.on(engine, 'collisionStart', function(event) {
        for (var i = 0; i < event.pairs.length; i++) {
            // TODO maybe some particle effects?
        }
    });

    bounds.push(new Boundary(0, 0, width, 5));
    bounds.push(new Boundary(0, 0, 5, height));
    bounds.push(new Boundary(0, height - 5, width, 5));
    bounds.push(new Boundary(width - 5, 0, 5, height));

    balls = [];
    for (var i = INITIAL_BALL_SPAWNS - 1; i >= 0; i--) {
        balls.push(new Ball());
    }
}

function draw() {
    Engine.update(engine);

    if (trails) {
        background(51, 60);
    } else {
        background(51);
    }

    for (var i = bounds.length - 1; i >= 0; i--) {
        bounds[i].draw();
    }

    for (var i = balls.length - 1; i >= 0; i--) {
        balls[i].checkAlive();
        if (balls[i].checkOnScreen()) {
            balls[i].draw();
        } else {
            balls.splice(i, 1);
        }
    }

    if (showStats) {
        var averageSpeed = 0;
        var maxSpeed = 0;
        var minSpeed = Number.MAX_SAFE_INTEGER;

        for (var i = balls.length - 1; i >= 0; i--) {
            var speed = sqrt(sq(balls[i].body.velocity.x) + sq(balls[i].body.velocity.y));
            averageSpeed += speed;
            if (maxSpeed < speed) {
                maxSpeed = speed;
            }
            if (minSpeed > speed) {
                minSpeed = speed;
            }
        }
        averageSpeed /= balls.length;

        noStroke();
        textSize(32);
        var fps = floor(frameRate());
        if (fps > 60) {
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

function Ball() {
    this.alive = true;
    this.r = random(10, 30);
    this.colour = color(random(130, 255), random(130, 255), random(130, 255), 127);

	// TODO collisions still aren't elastic despite the following options, energy is lost, WHY?
    var options = {
        restitution: 1,
        friction: 0,
        frictionAir: 0,
        density: this.r / 10
    };

    this.body = Bodies.circle(random(this.r, width - this.r), random(this.r, height - this.r), this.r, options);
    var xspeed = random(-1 * MAX_SPEED_AT_SPAWN_IN_ONE_DIRECTION, MAX_SPEED_AT_SPAWN_IN_ONE_DIRECTION);
    var yspeed = random(-1 * MAX_SPEED_AT_SPAWN_IN_ONE_DIRECTION, MAX_SPEED_AT_SPAWN_IN_ONE_DIRECTION);
    Matter.Body.applyForce(this.body, this.body.position, Matter.Vector.create(xspeed, yspeed));
    World.add(world, this.body);

    this.checkAlive = function() {
        if (this.body.velocity == Matter.Vector.create(0, 0)) {
            this.alive = false;
        }
    }

    this.checkOnScreen = function() {
        var x = this.body.position.x;
        var y = this.body.position.y;
        if (x < -50 || x > width + 50 || y > height + 50 || y < -50) {
            World.remove(world, this.body);
            return false;
        }
        return true;
    }

    this.draw = function() {
        if (this.alive) {
            noStroke();
        } else {
            stroke(color(255, 0, 0));
            strokeWeight(1);
        }
        fill(this.colour);
        ellipse(this.body.position.x, this.body.position.y, 2 * this.r);
    }
}

function Boundary(x, y, w, h) {
    var options = {
        restitution: 1,
        isStatic: true
    };

    this.w = w;
    this.h = h;
    this.body = Bodies.rectangle(x, y, w * 2, h * 2, options);
    // TODO Above line, w * 2, h * 2, otherwise boundaries are too small, but WHY?
    World.add(world, this.body);

    this.draw = function() {
        stroke(127);
        strokeWeight(1);
        fill(255, 127, 127);
        rect(this.body.position.x, this.body.position.y, this.w, this.h);
    }
}

function windowResized() {
    // TODO move boundaries etc
    resizeCanvas(windowWidth, windowHeight);
}
