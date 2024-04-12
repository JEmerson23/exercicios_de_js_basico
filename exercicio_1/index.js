// objeto para controle de atualização em tempo real da pagina 
const app = {
  tick: null, // armazana animationFrame
  renderList: [],
  start() { // iniciar atualizações
    if(this.renderList.length > 0) {
      this._update();
    }
  },

  _update() { // atualizar lista de renderização
    const self = this;

    this.renderList.forEach(
      ([callback, renderCondition]) => {
        if(renderCondition.test()) {
          callback(self); // elemento para ser executado
        }
      }
    );
      
    this.tick = requestAnimationFrame(
      () => { // manter loop
        self._update();
      }
    );
  },

  stop() { // para atualizações
    window.cancelAnimationFrame(this.tick);
  },

  addRenderElement(element, renderCondition) {
    // adcionar elementos para serem executado durante a atualização
    if(typeof element == "function") {
      this.renderList.push(
        [
          element,
          Object.assign({test() {return 1}}, renderCondition)
        ]
      );
      return this;
    }

    throw new Error(`${element} não é uma função`);
  }
};

class ImageOfTheTime {
  constructor(imageURL, dayMessage, backgroundColor, testTime) {
    this.url = imageURL || "";
    this.message = dayMessage || "";
    this.color = backgroundColor || "#3b3b3b";
    this._callback = testTime || function() {};
    
    if(this.url.length < 3) {
      throw new Error("a url deve ter no mínimo 3 caracteres...");
    } 

    if(this.message.length < 1) {
      throw new Error("a mensagem não deve está vazia...");
    }
  }

  test(hour) { // executar função de teste
    return this._callback(hour);
  }

  async render($img, $txtElement) {
    $img.src = this.url;
    $txtElement.textContent = this.message;
  }
}

const imageList = [ // lista de informações do dia
  new ImageOfTheTime(
    "./src/manha.png", "bom dia", "#ECC580",
    hours => hours >= 6 && hours < 12
  ),
  new ImageOfTheTime(
    "./src/tarde.png", "boa tarde", "#B5C8CF",
    hours => hours >= 12 && hours < 18
  ),
  new ImageOfTheTime(
    "./src/noite.png", "boa noite", "#20244C",
    hours => hours >= 18 || hours < 6
  )
];

app
  .addRenderElement(
    () => {
      const currentDate = new Date();
      updateInformationOfDay(currentDate, imageList);
    }, 
    { 
      previousHours: 0,
      test() {
        const currentHours = new Date().getHours();
        if(this.previousHours != currentHours) {
          this.previousHours = currentHours;
          return 1;
        }
      }
    }
  );

// init

window.addEventListener("DOMContentLoaded", () => {app.start()});

window.addEventListener("beforeunload", () => {app.close()});

// functions

function updateInformationOfDay(currentDate, informationList) {
  const currentHours = currentDate.getHours();

  const $dayImage = document.getElementById("day_image"),
    $dayMessage = document.getElementById("day_message");

  for(let img of informationList) {
    if(img.test(currentHours)) {
      img.render($dayImage, $dayMessage);
      document.body.style.backgroundColor = img.color
    }
  }
}