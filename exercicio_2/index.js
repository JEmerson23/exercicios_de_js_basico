class AgeBank {
  static createElement(numMin, numMax, imagePath) {
    class Element {
      constructor(min, max, data) {
        this._nums = new Uint8Array(2);
        this._nums[0] = min;
        this._nums[1] = max;
        this._data = data;
      }

      set min(value) {this._nums[0] = value }

      get min() { return this._nums[0] }

      set max(value) { this._nums[1] = value }

      get max() { return this._nums[1] }

      get data() { return this._data }
 
      test(value) {
        return value >= this._nums[0] && value <= this._nums[1];
      }
    }

    return new Element(numMin, numMax, imagePath);
  }

  constructor(databaseName, dirPath) {
    this.name = databaseName;
    this._storage = [];
    this._path = dirPath || "./";
  }

  add(A, B, filePath) {
    const newElement = AgeBank.createElement(A, B, filePath);

    this._storage.push(newElement);

    return this;
  }

  find(value) {
    return this._storage.find(element => element.test(value));
  }

  pathJoin() {
    return this._path.concat(...arguments);
  }
}

const databaseForMen = new AgeBank("homem", "./src/homem/");
const databaseForWomen = new AgeBank("mulher", "./src/mulher/");

databaseForMen
  .add(1, 11, "homem-criança.png")
  .add(12, 18, "homem-adolescente.png")
  .add(19, 29, "homem-jovem-adulto.png")
  .add(30, 59, "homem-adulto")
  .add(60, 122, "homem-idoso");

databaseForWomen
  .add(1, 11, "mulher-criança.png")
  .add(12, 18, "mulher-adolescente.png")
  .add(19, 29, "mulher-jovem-adulta.png")
  .add(30, 59, "mulher-adulta")
  .add(60, 122, "mulher-idosa");

document.getElementById("button_check_age").addEventListener(
  "click", event => {
    event.preventDefault();

    const elements = {
      $informationContainer: document.getElementById(
        "representative_img_container"
      ),
      $information: document.getElementById("output_age_data")
    };

    const data = processForm(
      document.getElementById("user_data_form")
    );
    
    elements.$information.textContent = "carregando...";

    renderResult(data, elements);
  }
);

function renderResult(data, elements) {
  const {$informationContainer, $information} = elements;
  const {age, gender, image} = data;

  if(handleExceptions(age, data, elements)) return;

  const $img = (($parent) => {
    let $element = $parent.getElementsByTagName("img")[0];

    if(!$element) {
      $element = document.createElement("img");
      $element.setAttribute("class", "anime-growing");
      $parent.appendChild($element);
    }

    $element.style.display = "block";

    return $element;
  })($informationContainer);
  
  const message = [
      `Detectamos ${gender} de `,
      `${age} ano${age > 1 ? 's' : ''}.`
    ]; 
  
  $information.textContent = message[0] + message[1];

  $img.alt = `${gender}, ${message[1]}`
  $img.src = image;

  function handleExceptions(value, data, elements) {
    const treatment = [];
    let solution;

    treatment.push([
      value == 0, `${data.gender} nasceu este ano.`
    ]);
    treatment.push([
      value > 122,
      `${data.gender} mort${
        data.gender[0] == 'h' ? 'o' : 'a'} de ${value} anos.`
    ]);
    treatment.push([
      value <= -1,
      `vai nascer daqui a ${Math.abs(value)} ano${
        Math.abs(value) > 1 ? 's' : ''}.`
    ]);
    treatment.push([
      value == null, "preencha todos os campos!"
    ]);
    
    solution = treatment.find(tr => tr[0]);

    if(solution) {
      let $img = 
        elements.$informationContainer
          .getElementsByTagName("img")[0];

      elements.$information.textContent = solution[1];

      if($img) {
        $img.style.display = "none";
      }

      return true;
    }
  }
}

function processForm($form) {
  const formData = new FormData($form);

  const response = {
    age: 0,
    gender: "",
    image: ""
  };

  let database;

  response.age = ((year) => {
    let result = new Date().getFullYear() - parseInt(year);

    if(isNaN(result)) return null;

    return result;
  })(
    formData.get("user_year_of_birth")
  );

  response.gender = ({
    male: "homem",
    female: "mulher"
  })[formData.get("user_gender")] || "";

  database = ((dbg) => {
    return [
      databaseForMen,
      databaseForWomen
    ].find(db => db.name == dbg);
  })(response.gender);

  response.image = ((db, num) => {
    const element = db.find(num);

    if(element) return db.pathJoin(element.data);
  })(database, response.age)

  return response;
}