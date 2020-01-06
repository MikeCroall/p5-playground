let fps = 25;
let FRAMES_PER_ITERATION = 25;
let systemCollection;
let system;
let sentence;

let captureVideoFrames = false;
const MAXIMUM_CAPTURE_FRAME_COUNT = 751; // 205=8.2 seconds@25fps 750=30 seconds@25fps

let capturer;
if (captureVideoFrames) {
    capturer = new CCapture({ format: 'png', framerate: 25, name: 'lsystemvid', verbose: true });
}
let canv;


function windowResized() {
    if (!captureVideoFrames) {
        resizeCanvas(windowWidth, windowHeight);
        background(0);
        sentence = undefined;
        system.reset(width, height);
    }
}

function setup() {
    let p5canvas;

    if (captureVideoFrames) {
        p5canvas = createCanvas(1920, 1080);
    } else {
        p5canvas = createCanvas(windowWidth, windowHeight);
    }

    canv = p5canvas.canvas;
    frameRate(fps);
    angleMode(DEGREES);

    systemCollection = {
       tree1: {
           name: "Dense Tree",
           root_x: width / 2,
           root_y: height,
           base_length: height / 4,
           length_multiplier: 0.5,
           angle_degrees: 22.5,
           axiom: "F",
           rules: [
               {
                   from: "F",
                   to: "FF+[+F-F-F]-[-F+F+F]"
               }
           ],
           current_depth: 0,
           maximum_depth: 5,
           reset: function(w, h) {
               this.current_depth = 0;
               this.root_x = w / 2;
               this.root_y = h;
               this.base_length = h / 4;
           }
       },
       plant1: {
           name: "Thin Plant",
           root_x: width / 2,
           root_y: height,
           base_length: height / 3,
           length_multiplier: 0.5,
           angle_degrees: 25,
           axiom: "X",
           rules: [
               {
                   from: "X",
                   to: "F+[[X]-X]-F[-FX]+X"
               },{
                   from: "F",
                   to: "FF"
               }
           ],
           current_depth: 0,
           maximum_depth: 7,
           reset: function(w, h) {
               this.current_depth = 0;
               this.root_x = w / 2;
               this.root_y = h;
               this.base_length = h / 3;
           }
       },
       bush1: {
           name: "Bush",
           root_x: width / 2,
           root_y: height,
           base_length: height / 3,
           length_multiplier: 0.7725,
           angle_degrees: 20,
           axiom: "VZFFF",
           rules: [
               {
                   from: "V",
                   to: "[+++W][---W]YV"
               },{
                   from: "W",
                   to: "+X[-W]Z"
               },{
                   from: "X",
                   to: "-W[+X]Z"
               },{
                   from: "Y",
                   to: "YZ"
               },{
                   from: "Z",
                   to: "[-FFF][+FFF]F"
               }
           ],
           current_depth: 0,
           maximum_depth: 10,
           reset: function(w, h) {
               this.current_depth = 0;
               this.root_x = w / 2;
               this.root_y = h;
               this.base_length = h / 3;
           }
       }
    }
    system = systemCollection.tree1;
    generateControlsGui();

    if (captureVideoFrames) {
        capturer.start();
    }
}

function draw() {
    if (frameCount === 1) {
        background(0);
    }
    if (frameCount % FRAMES_PER_ITERATION === 0) {
        if (!sentence) {
            sentence = system.axiom;
        } else {
            sentence = iterateOn(sentence, system);
        }
        turtleGraphics(sentence, system);
    }

    if (captureVideoFrames) {
        capturer.capture(canv);
        if (frameCount == MAXIMUM_CAPTURE_FRAME_COUNT) {
            noLoop();
            capturer.stop();
            capturer.save();
        }
    }
}

function iterateOn(sen, sys) {
    if (sys.current_depth >= sys.maximum_depth) {
        return sen;
    }

    let newSen = "";
    for (var i = 0; i < sen.length; i++) {
        let ruleMatched = false;
        for (var k = 0; k < sys.rules.length; k++) {
            if(sys.rules[k].from === sen.charAt(i)) {
                newSen += sys.rules[k].to;
                ruleMatched = true;
                break;
            }
        }
        if (!ruleMatched) {
            newSen += sen.charAt(i);
        }
    }
    sys.current_depth++;
    return newSen;
}

function turtleGraphics(sen, sys) {
    resetMatrix();
    translate(sys.root_x, sys.root_y);

    background(0);
    stroke(255, 165);
    strokeWeight(2);

    let length = sys.base_length * pow(sys.length_multiplier, sys.current_depth)
    for (var i = 0; i < sen.length; i++) {
        switch(sen.charAt(i)) {
            case "F":
                line(0, 0, 0, -length);
                translate(0, -length)
                break;
            case "+":
                rotate(sys.angle_degrees);
                break;
            case "-":
                rotate(-sys.angle_degrees);
                break;
            case "[":
                push();
                break;
            case "]":
                pop();
                break;
            default:
                /* Ignore unknown drawing character */
                break;
        }
    }
}

function generateControlsGui() {
    let divButtons = createDiv("Choose an L system");
    divButtons.position(0, 0);
    divButtons.id("divButtons");
    divButtons.style("color", "#fff");

    for (let sys in systemCollection) {
        let systemButton = createButton(systemCollection[sys].name || "unnamed");
        systemButton.parent("divButtons");
        systemButton.style("display", "block");
        systemButton.mousePressed(function() {
            system = systemCollection[sys];
            system.reset(width, height);
            sentence = undefined;
            background(0);
        });
    }
}