const infoSvg = document.getElementById('info-svg')
const searchBar = document.getElementById('search')
const fontRoot = parseInt(getComputedStyle(document.body).fontSize)
const initialSearchFontSize = parseInt(innerWidth) <= 768 ? 3 : 5

let locale = null

let oldInitials = ''
let oldEngine = 0 // Google
let currentEngine = 0 // Google
let engineNotFound = false
let engines = null
let darkMode = false

function setDark () {
  document.body.style.backgroundColor = '#212121'
  searchBar.classList.add('dark')
}

function getLocale () {
  locale = (navigator.language || 'en').split('-')[0]
}

function updateFont () {
  fetch('/font')
    .then((response) => response.text())
    .then((font) => {
      const fontNormalized = font.replace(' ', '+')
      const href = `https://fonts.googleapis.com/css2?family=${fontNormalized}&display=swap`
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      document.head.appendChild(link)
      searchBar.style.fontFamily = font
      console.log('Font set:' + font)
    })
}

function rndNum (max) {
  const rand = Math.round(Math.random() * max)
  return rand
}

function updateColor () {
  const hue = rndNum(360)
  const color = `hsl(${hue}, 100%, 50%)`
  searchBar.style.color = color
  infoSvg.style.color = color
}

function searchIt (queryArray) {
  const query = queryArray.join('+')
  console.log(query)
  const url = engines[currentEngine].url
    .replace('{q}', query)
    .replace('{loc}', locale)
  window.location.href = url
}

function updateLogo () {
  const fileName = engines[currentEngine].logo
  const fullUrl = `/img/logos/${darkMode ? 'dark_' : ''}${fileName}`
  document.getElementById('logo').style.backgroundImage = `url(${fullUrl})`
}

function updateEngine (initials) {
  let index = engines.findIndex((engine) =>
    engine.name.startsWith(initials)
  )
  engineNotFound = false
  if (index === -1) {
    index = 0
    engineNotFound = true
  }
  if (index !== oldEngine) {
    currentEngine = index
    updateLogo()
    oldEngine = currentEngine
  }
}

function pxToRem (element) {
  const fontPx = parseInt(getComputedStyle(element).fontSize)
  const fontRem = fontPx / fontRoot
  console.log(fontRem)
  return fontRem
}

function resizeText () {
  const numChars = parseInt(searchBar.value.length) + 2
  const searchBarWidth = parseInt(getComputedStyle(searchBar).width)
  if (searchBarWidth < (parseInt(innerWidth) + (2 * fontRoot))) {
    searchBar.style.width = `${numChars}ch`
  }
  if (numChars === 2) {
    searchBar.style.fontSize = `${initialSearchFontSize}rem`
  } else if (searchBarWidth + 2 * fontRoot >= parseInt(innerWidth)) {
    const fontSize = pxToRem(searchBar)
    if (fontSize > 1) {
      searchBar.style.fontSize = `${fontSize - 0.5}rem`
    }
  } else if (parseInt(getComputedStyle(searchBar).width) <= ((parseInt(innerWidth) / 2) + (2 * fontRoot))) {
    const fontSize = pxToRem(searchBar)
    if (fontSize < initialSearchFontSize) {
      searchBar.style.fontSize = `${fontSize + 0.5}rem`
    }
  }
}

function keyPressed (ev) {
  const values = searchBar.value
  const valuesArray = values.split(' ')
  if (ev.key === 'Enter') {
    if (!engineNotFound) {
      valuesArray.shift()
    };
    searchIt(valuesArray)
  } else {
    const initials = valuesArray[0].toLowerCase()
    if (oldInitials !== initials) {
      updateEngine(initials)
      oldInitials = initials
    }
  }
}

searchBar.addEventListener('keyup', keyPressed, false)
searchBar.addEventListener('keydown', resizeText, false)

function main () {
  updateFont()
  darkMode =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  if (darkMode) {
    setDark()
  } else {
    updateColor()
  }
  fetch('/engines')
    .then((response) => response.json())
    .then((data) => {
      engines = data.engines
      updateLogo()
    })
  getLocale()
}

main()
