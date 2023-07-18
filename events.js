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
    for(let i = 0; i < 33; i++) {
        DNA_SEQUENCE.value += Math.floor(Math.random()*10);
    }
});

EXECUTE.addEventListener("click", (event) => {
    EXECUTE.setAttribute("disabled", "");
    PAUSE.removeAttribute("disabled");
    oneFrame = false;
    loop();
});

PAUSE.addEventListener("click", (event) => {
    PAUSE.setAttribute("disabled", "");
    EXECUTE.removeAttribute("disabled");
    oneFrame = true;
    noLoop();
})

EXECUTE_ONE.addEventListener("click", (event) => {
    oneFrame = true;
    loop();
});
