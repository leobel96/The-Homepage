import React, { useEffect, useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import './App.css'
import fonts from './json/fonts.json'
import Info from './Info'
import Logo from './Logo'
import Search from './Search'
import Settings from './Settings'
import { darkTheme, lightTheme } from './Themes'
import ThemeSwitcher from './ThemeSwitcher'
import { useLocalStorage } from './utils'

const Container = styled.div`
  margin: 0;
  height: 100%;
  width: 100%;
  font-family: ${props => "'" + props.fontFamily + "'"};
  color: ${props => props.theme.text};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 18% 25% 20% auto;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: ${props => props.theme.background};
  opacity: ${props => props.menuIsOpen ? 0.5 : 1};
`

function getRandomInt (max) {
  return Math.floor(Math.random() * max)
}

function App () {
  const [logo, setLogo] = useState(null)
  const [optionName, setOptionName] = useState('')
  const [domain, setDomain] = useLocalStorage('domain', '.com')
  const [themeIsDark, setThemeIsDark] = useState(false)
  const [fontName, setFontName] = useState(null)
  const [menuIsOpen, setMenuIsOpen] = useState(false)

  useEffect(() => {
    const fontIdx = getRandomInt(fonts.length)
    setFontName(fonts[fontIdx])
    setThemeIsDark(window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches)
  }, [])

  useEffect(() => {
    if (fontName !== null) {
      console.debug('Font', fontName)
      const href = `https://fonts.googleapis.com/css2?family=${fontName.replace(' ', '+')}&display=swap`
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      document.head.appendChild(link)
    }
  }, [fontName])

  const changeTheme = () => {
    setThemeIsDark((dark) => !dark)
  }

  return (
    <ThemeProvider theme={themeIsDark ? darkTheme : lightTheme}>
      <Container fontFamily={fontName}>
        <ThemeSwitcher changeTheme={() => changeTheme()}/>
        <Settings setDomain={setDomain} currDomain={domain} menuIsOpen={menuIsOpen} setMenuIsOpen={setMenuIsOpen}/>
        <Grid menuIsOpen={menuIsOpen}>
          <div/>
          <Logo logoName={logo} optionName={optionName}/>
          <Search domain={domain} setLogo={setLogo} setOptionName={setOptionName}/>
        </Grid>
        <Info/>
      </Container>
    </ThemeProvider>
  )
}

export default App
