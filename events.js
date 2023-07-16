const ALLOW_DNA = document.getElementById("custom-dna");
const DNA_SEQUENCE = document.getElementById("dna-sequence");
const DNA_GENERATE = document.getElementById("generate-dna");

ALLOW_DNA.addEventListener('change', (event) => {
    if (this.checked) {
        DNA_SEQUENCE.removeAttribute("disabled");
        DNA_GENERATE.removeAttribute("disabled");
    } else {
        DNA_SEQUENCE.setAttribute("disabled", "");
        DNA_GENERATE.setAttribute("disabled", "");
    }
  });