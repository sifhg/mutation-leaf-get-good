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
grid = [[]];

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