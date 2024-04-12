import Popup from "./Popup.js";

class TestList {
  static get Test() {
    return class {
      constructor(callback, msg) {
        if(typeof callback === "function") {
          this._testFunction = callback;
        } else throw 0;
        this.message = msg || "";
      }

      exec(value) {
        return this._testFunction(value);
      }
    }
  }

  constructor() {
    this.list = [];
  }

  addTest(callback, msg) {
    try {
      const test = new TestList.Test(callback, msg);
      this.list.push(test);
      return this;
    } catch(e) {
      if(e === 0) return;
      else console.error(e);
    }
  }

  exec(value) {
    const positiveTest = this.list.find(tst => tst.exec(value));
    if(positiveTest) {
      popup.print(positiveTest.message);
      return false;
    }

    return true;
  }
}

const popup = new Popup("justOk");
popup.contentStyle.textAlign = "center";
document.body.appendChild(popup);

const numberList = [];
const numberInputTL = new TestList();

numberInputTL
  .addTest(
    value => value < 1 || value > 100,
    "o número deve esta entre 1 e 100"
  )
  .addTest(
    value => numberList.indexOf(value) !== -1,
    "este número já foi adicionado"
  );

document.getElementById("button_add_number").onclick = event => {
  const $input = document.getElementById("input_number");
  
  if($input.value.length > 0) {
    const $dataList = document.getElementById("select_output"),
    $option = document.createElement("option");
    let num = Number($input.value);
    
    if(numberInputTL.exec(num)) {
      numberList.push(num);

      $option.textContent = `Valor ${num} adicionado!`;
      $dataList.appendChild($option);

      $input.value = '';
      $input.focus();
    }
  } else {
    popup.print("adicione um número ao campo de entrada");
  }

  event.preventDefault();
};

document.getElementById("button_show_data").onclick = () => {
  if(numberList.length >= 2) {
    const $output = document.getElementById("data_output");
    const dataList = [
      `ao todo tem ${numberList.length} números`, 
      `o maior número: ${Math.max(...numberList)}`,
      `o menor número: ${Math.min(...numberList)}`,
      `a soma de todos os número: ${numberList.reduce((r, n) => r + n, 0)}`,
      `a média dos números: ${getAverage(numberList).toFixed(2)}`
    ];

    dataList.forEach(
      (data) => {$output.innerText += `${data}\n`;}
    );
  } else {
    popup.print("adicione no minimo dois números\npara a análise");
  }
};

document.getElementById("button_clear").onclick = () => {
  if(numberList.length > 0) {
    const $input = document.getElementById("input_number"),
      $output = document.getElementById("data_output");
    const $select = document.getElementById("select_output"),
      selectOptions = Array.from($select.childNodes),
      selectOptionsLength = selectOptions.length

    numberList.splice(0, numberList.length);

    $input.value = '';

    $output.innerText = '';

    for(let i = 0; i < selectOptionsLength; i++) {
      $select.removeChild(selectOptions[i])
    }
  }
}

function getAverage(arr) {
  return arr.reduce((r, n) => r + n, 0) / arr.length;
}
