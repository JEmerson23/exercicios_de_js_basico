class Popup extends HTMLElement {
  constructor(just) {
    super();

    this._shadowRoot = this.attachShadow({mode: "closed"});
    this._stateClass = ["popup-close", "popup-open"];
    this.isJustOk = just.toLowerCase() === "justok"
    this.isJustClose = just.toLowerCase() === "justclose";
    this.state = 0;

    const style = `
      <style>
        .popup-open {
          width: 100vw; height: 100vh;
          display: flex; align-item: center;
          flex-direction: column; justify-content: center;
          position: fixed; top: 0; left: 0;
          backdrop-filter: blur(2px); z-index: 999;
        }

        .popup-close { display: none; }

        .popup__contentBox {
          min-width: 200px; width: 60vw;
          max-width: 400px; margin: 0 auto;
          padding: 0; border-radius: 7px;
          display: flex; align-item: center;
          flex-direction: column; justify-content: center;
          background-color: #fff; overflow: hidden;
          box-shadow: 2px 1px 10px rgba(0,0,0,0.4);
          z-index: 1000; position: relative; top: -25%;
        }

        .popup__content {
          width: 98%; padding: 6px 3px 6px 3px; margin: 0 auto;
          font-size: 1em; text-indent: 0;
        }

        .popup__ui-normal, .popup__ui-center {
          width: 100%; display: flex;
          align-item: center; flex-direction: row;
          flex-wrap: nowrap; justify-content: space-evenly;
          position: relative; bottom: 0;
        }

        .popup__ui-center { justify-content: center; }

        .popup__ui-center .popup__actionButton {
          width: 100%;
        }

        .popup__actionButton + .popup__actionButton {
          border-left: 2px solid #d3d3d3;
        }

        .popup__actionButton {
          width: 50%; border: none; cursor: pointer;
          background-color: #e1e1e1; font-size: 0.9em;
          transition: transform 0.25s; user-select: none;
        }

        .popup__actionButton:active { transform: scale(0.9);}
      </style>
    `;

    const buttons = (() => {
      const b1 = 
        "<button id=\"button_ok\" class=\"popup__actionButton\">ok</button>",
      b2 = `
        <button id=\"button_cancel\" class=\"popup__actionButton\">
          cancel
        </button>`;

      if(!this.isJustClose && !this.isJustOk) {
        return b1 + b2;
      }

      return this.isJustOk ? b1 :  b2;
      }
    )();

    this._shadowRoot.innerHTML = `
      <section id="popup" class="${this._stateClass[this.state]}">
        ${style}
        <div class="popup__contentBox">
          <output id="popup_output" class="popup__content"></output>
          <nav class="popup__ui-${this.isJustOk || this.isJustClose ? "center" : "normal"}">
            ${buttons}
          </nav>
        </div>
      </section>
    `;

    this.onok = () => {};
    this.oncancel = () => {};
  }

  _changeState() {
    const $popup = this._shadowRoot.querySelector("#popup");
    $popup.classList.remove(
      this._stateClass[this.state]
    );
    this.state = Math.abs(this.state-1);
    $popup.classList.add(
      this._stateClass[this.state]
    );
  }

  set onok(callback) {
    const self = this, 
      $element = this._shadowRoot.querySelector("#button_ok");

    if($element) 
      if(typeof callback === "function") 
        $element.addEventListener("click", () => {
            callback(...arguments);
            self.close();
          });
  }

  set oncancel(callback) {
    const self = this,
      $element = this._shadowRoot.querySelector("#button_cancel");
    
    if($element)
      if(typeof callback === "function")
        $element.addEventListener("click", () => {
            callback(...arguments);
            self.close();
          });
  }

  set textContent(value) {
    this._shadowRoot.querySelector("#popup_output").innerText = value;
  }

  get textContent() {
    return this._shadowRoot.querySelector("#popup_output").textContent;
  }

  set contentStyle(value) {
    this._shadowRoot.querySelector("#popup_output").style = value;
  } 

  get contentStyle() {
    return this._shadowRoot.querySelector("#popup_output").style;
  }

  open() {
    this._changeState();
  }

  close() {
    this.textContent = '';
    this._changeState();
  }

  print(value) {
    this.textContent = value;
    this.open();
  }
}

customElements.define("popup-box", Popup);

export default Popup;