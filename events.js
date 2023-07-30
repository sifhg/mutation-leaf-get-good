const ALLOW_DNA = document.getElementById("custom-dna");
const DNA_SEQUENCE = document.getElementById("dna-sequence");
const DNA_GENERATE = document.getElementById("generate-dna");
const EXECUTE = document.getElementById("execute");
const PAUSE = document.getElementById("pause");
const EXECUTE_ONE = document.getElementById("execute-one");


ALLOW_DNA.addEventListener('change', (event) => {
    DNA_SEQUENCE.removeAttribute("disabled") 
    if (ALLOW_DNA.checked) {
        DNA_SEQUENCE.removeAttribute("disabled");
        DNA_GENERATE.removeAttribute("disabled");
    } else {
        DNA_SEQUENCE.setAttribute("disabled", "");
        DNA_GENERATE.setAttribute("disabled", "");
    }
});

DNA_GENERATE.addEventListener("click", (event) => {
    DNA_SEQUENCE.value = "";
    let numbericalDNA = [];
    for(let i = 0; i < 33; i++) {
        const RANDOM_NUMBER = Math.floor(Math.random()*256);
        DNA_SEQUENCE.value += String.fromCharCode(RANDOM_NUMBER +33);
        numbericalDNA.push(RANDOM_NUMBER);
    }
    theGrower = new Grower(0, Math.floor(theGrid.y/2), 3, numbericalDNA);
    theGrower.display(theGrid);
});

EXECUTE.addEventListener("click", (event) => {
    EXECUTE.setAttribute("disabled", "");
    EXECUTE_ONE.setAttribute("disabled", "");
    PAUSE.removeAttribute("disabled");
    oneFrame = false;
    loop();
});

PAUSE.addEventListener("click", (event) => {
    PAUSE.setAttribute("disabled", "");
    EXECUTE.removeAttribute("disabled");
    EXECUTE_ONE.removeAttribute("disabled");
    oneFrame = true;
    noLoop();
})

EXECUTE_ONE.addEventListener("click", (event) => {
    oneFrame = true;
    loop();
});
