const app = {
  _testInputNumber(value, min, max, name) {
    if(value.length < 1) throw "preencha todos os campos!";

    if(!isNaN(Number(value))) {
      const NUM = Number(value);

      if(NUM >= min && NUM <= max) {
        return NUM;
      } else {
        throw `o valor do input "${name}" deve ser maior ou igual a ${min
          } e menor ou igual a ${max}`;
      }


    } else throw `os valores passados devem ser um números`;
  },

  init() {
    const formData = new FormData(
      document.getElementById("data_form")
    );

    let result = ``;

    try {
      const START = this._testInputNumber(
        formData.get("ipt_start1"), -999, 999, "inicio");
      const END = this._testInputNumber(
        formData.get("ipt_end"), -999, 999, "fim");
      const STEPS = this._testInputNumber(
        formData.get("ipt_steps"), 1, (START > END ? START : END), "passos");

      if(START < END) {
        for(let count = START; count < END; count += STEPS) {
          result += count + " &#x1F449; ";
        }
      } else if(START > END) {
        for(let count = START; count > END; count -= STEPS) {
          result += count + " &#x1F449; ";
        }
      } else {
        throw "o inicio não pode ser igual ao fim.";
      }
      
      result += END + " &#x1F6A9;";
    } catch(e) {
      if(e instanceof Error) {
        console.log(e);
        return;
      }
      
      result = e;
    } 

    document.getElementById("output_result").innerHTML = result;
  }
};

Object.freeze(app);

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("button_init").addEventListener(
    "click", (event) => {
      event.preventDefault();
      app.init();
    }
  );
});