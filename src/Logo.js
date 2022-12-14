import PropTypes from 'prop-types'
import React from 'react'
import styled, { withTheme } from 'styled-components'
const reqSvgs = require.context('../public/img/logos', true, /\.svg$/)

const LogoDiv = styled.div`
  height: 80%;
  width: 100%;
  margin: auto;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${props => reqSvgs(props.url)});
  opacity: 0.8;
  font-family: monospace;
  font-size: 2rem;

  @media only screen and (max-width: 768px) {
    /* For mobile phones: */
    height: 60%;
  }
`

function Logo (props) {
  return (
    props.logoName !== null &&
      <LogoDiv url={`./${props.theme.logoPrefix}${props.logoName}`}>
        {props.optionName}
      </LogoDiv>
  )
}

Logo.propTypes = {
  logoName: PropTypes.string,
  optionName: PropTypes.string.isRequired,
  theme: PropTypes.object
}

export default withTheme(Logo)
