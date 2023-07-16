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