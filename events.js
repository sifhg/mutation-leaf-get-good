const ALLOW_DNA = document.getElementById("custom-dna");
const DNA_SEQUENCE = document.getElementById("dna-sequence");
const DNA_GENERATE = document.getElementById("generate-dna");

ALLOW_DNA.addEventListener('change', (event) => {
    console.log("checked");
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
    for(let i = 0; i < 23; i++) {
        DNA_SEQUENCE.value += Math.floor(Math.random()*10);
    }
});