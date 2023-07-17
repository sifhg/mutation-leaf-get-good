//Colours from style
let backgroundColourDark;
let backgroundColourLight;
let veinColour;
let leafColourStrong;
let leafColourWeak;
let leafColourDamaged;
document.addEventListener("DOMContentLoaded", (event)=> {
    let rootStyle = getComputedStyle(document.documentElement);

    backgroundColourDark = rootStyle.getPropertyValue("--background-colour-dark");
    backgroundColourLight = rootStyle.getPropertyValue("--background-colour-light");
    veinColour = rootStyle.getPropertyValue("--vein-colour");
    leafColourStrong = rootStyle.getPropertyValue("--leaf-colour-strong");
    leafColourWeak = rootStyle.getPropertyValue("--leaf-colour-weak");
    leafColourDamaged = rootStyle.getPropertyValue("--leaf-colour-damaged");
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
    return color(`hsla(${H}, ${S}%, ${lightness}, ${A})`);
}

function mixColours(colour1, colour2, weight) {
    //weight is a value between 0 and 1 that determines how close the mix should be to colour 2.
    const H = hue(colour1) * (1-weight) + hue(colour2) * weight;
    const S = saturation(colour1) * (1-weight) + saturation(colour2) * weight;
    const L = lightness(colour1) * (1-weight) + lightness(colour2) * weight;
    const A = alpha(colour1) * (1-weight) + alpha(colour2) * weight;
    return color(`hsla(${H}, ${S}%, ${lightness}, ${A})`);
}

class Grid {
    constructor(x, y) {
        this.x;
        this.y;
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
        for(w = 0; w < this.x; w++) {
            for(h = 0; h < this.y; h++) {
                noStroke();
                switch(this.grid[w][h][0]) {
                    case "E":
                        noFill();
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
                const C = {
                    x: (w*width/this.x) + ((h%2 == 1) ? (1/4 * width/this.x): (3/4 * width/this.x)),
                    y: h*height/this.y
                }
                const octagon = {
                    //x = [
                    //    cos(0)
                    //]
                }
            }
        }
    }
}

class Neuron {
    constructor(wb) {
        this.weights = [];
        this.bias = wb[wb.length];
        for(let w = 0; w < wb.length-1; w++) {
            thisweights.push(wb[w]);
        }
    }
    activate(signalIn) {
        if(signalIn.length != this.weights.length) {
            console.error("Number of input signals to neuron must match number of weights");
        }
        let outputSignal = 0;
        for(let w = 0; w < signalIn.length; w++) {
            outputSignal += this.weights[w]*signalIn[w];
        }
        outputSignal += this.bias;
        return outputSignal;
    }
}
class NeuronLayer {
    constructor(numberOfNeurons, numberOfWeights, wb) {
        this.weightsAndBiases = wb;
        if(numberOfWeights != wb-1) {
            console.error("In a neuron layer, the number of weights must match the length of array of weights inserted");
        }
        this.neurons = [];
        for(n = 0; n < numberOfNeurons; n++) {
            this.neurons.push(new Neuron(this.weightsAndBiases.slice(0,numberOfWeights+1)));
            this.weightsAndBiases = this.weightsAndBiases.slice(numberOfWeights+1);
        }
    }
}

class Grower {
    constructor(x, y, dir, DNA) {
        this.x = x;
        this.y = y;
        this.direction = dir;
        this.dna = DNA;
        this.neurons = [];
        this.kernelPosition = 0;
        this.kernelSize = 4;

        /*
        There are 4 inputs from the kernel moving over the DNA
        There are 3 neurons in the first layer, each with a weight for each input (4) as well as a bias.
        The first layer has a total number of 15 weights and biases.
        The second layer has each a weight for each neuron in the first layer (3), plus a bias.
        The second layer has a total of 12 weights and biases.
        That gives a total number of 27 weights and biases.
        */
        this.neurons.push(new NeuronLayer(3, 4, this.dna[0,15]));
        this.dna = this.dna.slice(15);
        this.neurons.push(new NeuronLayer(3, 3, this.dna));
        this.dna = DNA;
    }
}

function setup() {
    const DISPLAY = document.getElementById("display");
    let canvas = createCanvas(DISPLAY.offsetWidth, DISPLAY.offsetHeight);
    canvas.parent("display");
    background(backgroundColourDark);
    addEventListener("resize", (event) => {
        canvas.resize(DISPLAY.offsetWidth, DISPLAY.offsetHeight);
        background(backgroundColourDark);
    });
}