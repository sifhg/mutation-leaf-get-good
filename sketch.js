//Colours from style
let backgroundColourDark;
let backgroundColourLight;
let veinColour;
let leafColourStrong;
let leafColourWeak;
let leafColourDamaged;
let growerColours;

let frameDisplay;

document.addEventListener("DOMContentLoaded", (event)=> {
    let rootStyle = getComputedStyle(document.documentElement);

    backgroundColourDark = rootStyle.getPropertyValue("--background-colour-dark");
    backgroundColourLight = rootStyle.getPropertyValue("--background-colour-light");
    veinColour = rootStyle.getPropertyValue("--vein-colour");
    leafColourStrong = rootStyle.getPropertyValue("--leaf-colour-strong");
    leafColourWeak = rootStyle.getPropertyValue("--leaf-colour-weak");
    leafColourDamaged = rootStyle.getPropertyValue("--leaf-colour-damaged");
    growerColours = rootStyle.getPropertyValue("--grower-colour");

    frameDisplay = document.getElementById("step-counter");
});

function setAlpha(colour, alpha) {
    //add alpha to a colour
    const R = red(colour);
    const G = green(colour);
    const B = blue(colour);
    return color(R, G, B, alpha);
}

function setLightness(colour, lightness) {
    const H = hue(colour);
    const S = saturation(colour);
    const A = alpha(colour);
    return color(`hsla(${H}, ${S}%, ${lightness}%, ${A})`);
}

function mixColours(colour1, colour2, weight) {
    //weight is a value between 0 and 1 that determines how close the mix should be to colour 2.
    const H = (hue(colour1) * (1-weight)) + (hue(colour2) * weight);
    const S = (saturation(colour1) * (1-weight)) + (saturation(colour2) * weight);
    const L = (lightness(colour1) * (1-weight)) + (lightness(colour2) * weight);
    const A = (alpha(colour1) * (1-weight)) + (alpha(colour2) * weight);
    return `hsla(${floor(H)}, ${floor(S)}%, ${floor(L)}%, ${floor(A)})`;
    
}

class Grid {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.grid = [];
        /*
        Grid values can be:
        "E" for empty,
        "V" for vein,
        "L" for leaf, or
        "D" for damaged.
        */
        for(let w = 0; w < this.x; w++) {
            this.grid.push([]);
            for(let h = 0; h < this.y; h++) {
                this.grid[w].push("E");
            }
        }
    }
    display() {
        const CELL_SIZE = {
            x: width/(this.x*2),
            y: height/(this.y*2)
        }
        for(let w = 0; w < this.x; w++) {
            for(let h = 0; h < this.y; h++) {
                const CELL_CENTER = {
                    x: (w*width/this.x) + ((h%2 == 1) ? (1/4 * width/this.x): (3/4 * width/this.x)),
                    y: h*height/this.y + CELL_SIZE.y
                }

                noStroke();
                switch(this.grid[w][h][0]) {
                    case "E":
                        noFill();
                        stroke(setAlpha(veinColour, 16));
                        break;
                    case "L":
                        fill(mixColours(leafColourStrong, leafColourWeak, 
                            parseFloat(this.grid[w][h]).slice(1)));
                        break;
                    case "V":
                        fill(veinColour);
                        break;
                    case "D":
                        fill(leafColourDamaged);
                    default:
                        console.error("A grid state must begin with either 'E', 'V', 'L', or 'D'");
                }
                push(); 
                    translate(CELL_CENTER.x, CELL_CENTER.y);
                    rotate(TWO_PI/4)
                    beginShape();
                        for(let a = 0; a < TWO_PI; a += TWO_PI/6) {
                            const X = CELL_SIZE.y * 1.275 * cos(a);
                            const Y = CELL_SIZE.x * 1.10 * sin(a);
                            vertex(X, Y);
                        }
                    endShape(CLOSE);
                pop(); 
            }
        }
    }
}

class Grower {
    constructor(x, y, dir, DNA) {
        this.x = x;
        this.y = y;
        this.direction = dir; //direciton is an integer 0 <= dir < 6
        this.dna = [];
        for(const GENE of DNA) {
            this.dna.push(GENE/256);
        }

        //Setting the TensorFlow neural model 
        this.brain = tf.sequential();

        //Add input layer
        this.brain.add(tf.layers.dense({units: 3,
                                        activation: "relu",
                                        bias: true,
                                        inputShape: [6]}));

        //Add hidden layer
        this.brain.add(tf.layers.dense({units: 3,
                                        activation: "relu",
                                        bias: true}));

        //Add output layer
        this.brain.add(tf.layers.dense({units: 3,
                                        activation: "sigmoid",
                                        bias: true}));

        //Set weights and biases, so the correspond to the DNA
        //this.brain.setWeights(this.dna);

        this.kernelPosition = 0;
        this.kernelSize = 3;

        if(!Number.isInteger(this.direction) || this.direction < 0 || this.direction > 5) {
            console.error(`Grower's direction must be an integer between 0 and 5. direction is currently ${this.direction}`);
        }
        

        /*
        There are 3 inputs from the kernel moving over the DNA.
        There are 3 inputs from the wetness sensors.
        There are 3 neurons in the first layer, each with a weight for each input (6) as well as a bias.
        The first layer has a total number of 21 weights and biases.
        The second layer has each a weight for each neuron in the first layer (3), plus a bias.
        The second layer has a total of 12 weights and biases.
        That gives a total number of 33 weights and biases.
        */
    }
    display(grid) {
        noStroke();
        fill(growerColours);
        const CENTER = {
            x: (this.x*width/grid.x) + ((this.y%2 == 1) ? (1/4 * width/grid.x): (3/4 * width/grid.x)),
            y: this.y*height/grid.y + height/(grid.y*2)
        }
        

        push(); 
            translate(CENTER.x, CENTER.y);
            rotate(-TWO_PI*(this.direction-1)/6)
            const POINT0  = {
                x: width/(grid.x*2) * cos(TWO_PI*11/12),
                y: height/(grid.y*2) * sin(TWO_PI*11/12)
            }
            const POINT1  = {
                x: width/(grid.x*2) * cos(TWO_PI*4/12),
                y: height/(grid.y*2) * sin(TWO_PI*4/12)
            }
            const POINT2  = {
                x: width/(grid.x*2) * cos(TWO_PI*9/12),
                y: height/(grid.y*2) * sin(TWO_PI*9/12)
            }
            beginShape();
                vertex(POINT0.x, POINT0.y);
                vertex(POINT1.x, POINT1.y);
                vertex(POINT2.x, POINT2.y);
            endShape(CLOSE);
            fill(255,0,0);
        pop(); 
    }
}

let theGrid = new Grid(45, 30);
let dayLength = 1000;
let sunlight;
let oneFrame = true;

function setup() {
    const DISPLAY = document.getElementById("display");
    let canvas = createCanvas(DISPLAY.offsetWidth, DISPLAY.offsetHeight);
    canvas.parent("display");
    background(backgroundColourDark);
    addEventListener("resize", (event) => {
        canvas.resize(DISPLAY.offsetWidth, DISPLAY.offsetHeight);
        background(backgroundColourDark);
        background(mixColours(backgroundColourDark, backgroundColourLight, sunlight));
        theGrid.display();
    });
}

function draw() {
    sunlight = map((frameCount%dayLength < dayLength/2) ? frameCount%dayLength : dayLength-(frameCount%dayLength), 0, dayLength/2, 0, 1);
    background(mixColours(backgroundColourDark, backgroundColourLight, sunlight));
    //background(backgroundColourDark);
    theGrid.display();
    if(typeof theGrower != "undefined") {
        theGrower.display(theGrid);
    }
    if(oneFrame) {
        noLoop();
    }
    frameDisplay.textContent = frameCount%dayLength;
}