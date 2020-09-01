const infoSvg = document.getElementById("info-svg");
const searchBar = document.getElementById("search");

let locale = null;

let oldInitials = "";
let oldEngine = 0; // Google
let currentEngine = 0; // Google
let engineNotFound = false;
let engines = null;
let darkMode = false;

function setDark() {
  document.body.style.backgroundColor = "#212121";
  searchBar.classList.add("dark");
}

function getLocale() {
  locale = (navigator.language || "en").split("-")[0];
}

function updateFont() {
  fetch("/font")
    .then((response) => response.text())
    .then((font) => {
      const fontNormalized = font.replace(" ", "+");
      const href = `https://fonts.googleapis.com/css2?family=${fontNormalized}&display=swap;text=Search`;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
      searchBar.style.fontFamily = font;
      console.log("Font set:" + font);
    });
}

function rndNum(max) {
  const rand = Math.round(Math.random() * max);
  return rand;
}

function updateColor() {
  const hue = rndNum(360);
  const color = `hsl(${hue}, 100%, 50%)`;
  searchBar.style.color = color;
  infoSvg.style.color = color;
}

function searchIt(queryArray) {
  const query = queryArray.join("+");
  console.log(query);
  const url = engines[currentEngine]["url"]
    .replace("{q}", query)
    .replace("{loc}", locale);
  window.location.href = url;
}

function updateLogo() {
  const fileName = engines[currentEngine]["logo"];
  const fullUrl = `/img/logos/${darkMode ? "dark_" : ""}${fileName}`;
  document.getElementById("logo").style.backgroundImage = `url(${fullUrl})`;
}

function updateEngine(initials) {
  let index = engines.findIndex((engine) =>
    engine["name"].startsWith(initials)
  );
  engineNotFound = false;
  if (index === -1) {
    index = 0;
    engineNotFound = true;
  }
  if (index !== oldEngine) {
    currentEngine = index;
    updateLogo();
    oldEngine = currentEngine;
  }
}

function keyPressed(ev) {
  const values = searchBar.value.split(" ");
  if (ev.key === "Enter") {
    if (!engineNotFound) {
      values.shift()
    };
    searchIt(values);
  } else {
    const initials = values[0].toLowerCase();
    if (oldInitials !== initials) {
      updateEngine(initials);
      oldInitials = initials;
    }
  }
}

searchBar.addEventListener("keyup", keyPressed, false);

function main() {
  updateFont();
  darkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (darkMode) {
    setDark();
  } else {
    updateColor();
  }
  fetch("/engines")
    .then((response) => response.json())
    .then((data) => {
      engines = data["engines"];
      updateLogo();
    });
  getLocale();
}

main();
