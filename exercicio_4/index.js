const app = {
  _firstTime: [true],

  _getTypeOfOperation() {
    const $select = document.getElementById("select_type_of_operation");

    const type = [
      ["&#43;", (a,b) => a + b],
      ["&minus;", (a,b) => a - b],
      ["&times;", (a,b) => a * b],
      ["&divide;", (a,b) => {
        if(a == 0 || b == 0) {
          return 0;
        }
        return a / b
      }]
    ];

    return type[
      (
        list => [].find.call(list, $option => $option.selected).value
        )($select.childNodes)
      ];
    },
    
  clearResultOutput() {
    document.getElementById("output_result").textContent = '';
  },

  init() {
    const NUM = document.getElementById("input_number").valueAsNumber;
    
    if(!isNaN(NUM) && NUM <= 100) {
      const optionList = (() => {
        const $select = document.getElementById("select_operation");
        
        if(this._firstTime[0]) {
          for(let i = 0; i <= 10; i++) {
            let $option = document.createElement("option");
            $option.setAttribute("value", i);
            $select.appendChild($option);
          }
          
          this._firstTime[0] = false;
        }
        
        return $select.childNodes;
      })();
      
      const typeOfOperation = this._getTypeOfOperation()[0];

      for(let i = 0; i<= 10; i++) {
        let txt = "";
        if(
          (typeOfOperation == "&#43" || typeOfOperation == "&times;")
        ) txt = `${NUM} ${typeOfOperation} ${i}`;
        else txt = `${i} ${typeOfOperation} ${NUM}`;

        optionList[i].innerHTML = txt;
      }

      this._previousInputValue = NUM;
    }
  },
  
  getResultOfSelectedOperation() {
    if(this._firstTime[0]) return;
    
    const getDataRE = /^(\d+)\s.{1}\s(\d+)$/;

    const $selectedOption = (
      list => [].find.call(
        list,
        $option => $option.selected
      )
    )(
      document.getElementById("select_operation").childNodes
    );
        
    const optionOperation = 
      $selectedOption ? $selectedOption.innerText : '';
  
    if(getDataRE.test(optionOperation)) {
      const [N1, N2] = optionOperation.match(getDataRE).slice(1,3);
      const operation = this._getTypeOfOperation()[1];
      
      return operation(Number(N1), Number(N2));
    }
  },
      
  showResultOfSelectedOperation() {
    let result = this.getResultOfSelectedOperation();
    if(result != undefined) {
      if(result % 1 != 0) result = Number(result).toFixed(3).replace('.', ',');

      document.getElementById("output_result").textContent = result;
    }
  },

};

Object.freeze(app);

document.getElementById("input_number").addEventListener(
  "input", () => {
    app.init();
    app.clearResultOutput();
  }
);

document.getElementById("select_type_of_operation").addEventListener(
  "change", () => {
    app.init();
    app.showResultOfSelectedOperation();
  }
);

document.getElementById("select_operation").addEventListener(
  "change", () => {
    app.showResultOfSelectedOperation();
  }
);

document.getElementById("button_init").addEventListener(
  "click", event => {
    event.preventDefault();

    app.init();
    app.showResultOfSelectedOperation();
});