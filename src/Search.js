import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import engines from './engines.json'

const Input = styled.input`
  display: block;
  border: none;
  padding: 0;
  margin: auto;
  align-self: center;
  font-size: ${props => props.fontSize}rem;
  font-family: inherit;
  outline: none;
  text-align: center;
  caret-color: ${props => props.theme.caret};
  min-width: 6ch;
  width: 80%;
  background-color: transparent;
  color: inherit;
  opacity: 0.8;

  @media only screen and (max-width: 768px) {
    /* For mobile phones: */
    width: 90%;
  }
`

function Search ({ domain, setLogo, setOptionName }) {
  const [inputContent, setInputContent] = useState('')
  const [currentEngine, setCurrentEngine] = useState(engines[0])
  const [currentOption, setCurrentOption] = useState(null)
  const [currentQuery, setCurrentQuery] = useState('')
  const [fontSize, setFontSize] = useState(0)
  const inputRef = useRef(null)
  const defaultFontSize = useRef(null)

  useEffect(() => {
    defaultFontSize.current = screen.width > 768 ? 5 : 3
    setFontSize(defaultFontSize.current)
  }, [])

  function searchIt () {
    const query = encodeURIComponent(currentQuery)
    const url = currentOption === null
      ? currentEngine.url
        .replace('{q}', query)
        .replace('{domain}', domain)
      : currentOption.url
        .replace('{q}', query)
        .replace('{domain}', domain)
    window.location.href = url
  }

  function handleSubmit (e) {
    e.preventDefault()
    searchIt()
  }

  useEffect(() => {
    const regexp = /^(\S*)\s*(\S*)\s*(.*)/
    const match = inputContent.match(regexp)
    let matchedOption = false
    let query = inputContent
    let tempOption = null
    let tempEngine = engines[0] // Google
    if (match !== null) {
      for (const engine of engines) {
        if (match.length > 1 && engine.name.startsWith(match[1])) {
          tempEngine = engine
          if (match.length > 2 && match[2] !== '' && 'options' in engine) {
            for (const option of engine.options) {
              if (option.name.startsWith(match[2])) {
                tempOption = option
                matchedOption = true
                break
              }
            }
            query = matchedOption ? '' : match[2]
            if (match.length > 3) {
              query += match[3]
            }
          }
          break
        }
      }
    }
    setCurrentEngine(tempEngine)
    setCurrentOption(tempOption)
    setOptionName(tempOption === null ? '' : tempOption.name)
    setCurrentQuery(query)
  }, [inputContent])

  useEffect(() => {
    setLogo(currentEngine.logo)
  }, [currentEngine])

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <Input type='text' placeholder='Search' autoComplete='off' spellCheck='false' autoCorrect='off' autoFocus={true} fontSize={fontSize} onChange={(e) => setInputContent(e.target.value)} value={inputContent} ref={inputRef}/>
    </form>
  )
}

Search.propTypes = {
  domain: PropTypes.string.isRequired,
  setLogo: PropTypes.func.isRequired,
  setOptionName: PropTypes.func.isRequired
}

export default Search
