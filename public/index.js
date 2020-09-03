const infoSvg = document.getElementById('info-svg')
const searchBar = document.getElementById('search')
const logo = document.getElementById('logo')
const fontRoot = parseInt(getComputedStyle(document.body).fontSize)
const initialSearchFontSize = parseInt(innerWidth) <= 768 ? 3 : 5

let locale = null
let engines = null
let currentEngine = 0 // Google
let oldEngineInitials = ''
let currentOption = null
let oldOptionInitials = ''
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
  const currentEngineTemp = currentEngine | 0
  const clonedArray = queryArray.slice()
  console.log(clonedArray)
  if (currentEngine !== null) {
    clonedArray.shift()
  }
  if (currentOption !== null) {
    clonedArray.shift()
  }
  const query = clonedArray.join('+')
  console.log(query)
  const url = currentOption === null
    ? engines[currentEngineTemp].url
      .replace('{q}', query)
      .replace('{loc}', locale)
    : engines[currentEngineTemp].options[currentOption].url
      .replace('{q}', query)
      .replace('{loc}', locale)
  window.location.href = url
}

function updateOptionText () {
  const currentEngineTemp = currentEngine | 0
  logo.innerText = currentOption === null
    ? ''
    : engines[currentEngineTemp].options[currentOption].name
}

function updateOption (initials) {
  if (initials !== '') {
    const currentEngineTemp = currentEngine | 0
    if (engines[currentEngineTemp].options !== undefined) {
      const index = engines[currentEngineTemp].options.findIndex((option) =>
        option.name.startsWith(initials)
      )
      if (index === -1) {
        currentOption = null
        updateOptionText()
      } else if (index !== currentOption) {
        currentOption = index
        updateOptionText()
      }
    }
  } else {
    currentOption = null
    updateOptionText()
  }
}

function updateLogo () {
  const currentEngineTemp = currentEngine | 0
  const fileName = engines[currentEngineTemp].logo
  const fullUrl = `/img/logos/${darkMode ? 'dark_' : ''}${fileName}`
  logo.style.backgroundImage = `url(${fullUrl})`
}

function updateEngine (initials) {
  let index = engines.findIndex((engine) =>
    engine.name.startsWith(initials)
  )
  if (index === -1) {
    index = 0
    currentEngine = null
    updateLogo()
  } else if (index !== currentEngine) {
    currentEngine = index
    updateLogo()
  }
}

function pxToRem (element) {
  const fontPx = parseInt(getComputedStyle(element).fontSize)
  const fontRem = fontPx / fontRoot
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
    searchIt(valuesArray)
  } else {
    console.log(valuesArray)
    if (valuesArray.length === 1) {
      // Writing engine initials
      const newEngineInitials = valuesArray[0].toLowerCase()
      if (oldEngineInitials !== newEngineInitials) {
        updateEngine(newEngineInitials)
        oldEngineInitials = newEngineInitials
      }
      currentOption = null
      updateOptionText()
    } else {
      // Writing option initials
      const newOptionInitials = valuesArray[1].toLowerCase()
      if (oldOptionInitials !== newOptionInitials) {
        updateOption(newOptionInitials)
        oldOptionInitials = newOptionInitials
      }
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
