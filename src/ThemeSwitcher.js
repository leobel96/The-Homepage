import { Icon } from '@iconify-icon/react'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { withTheme } from 'styled-components'

const Link = styled.a`
  position: absolute;
  font-size: 3rem;
  color: ${props => props.theme.icons};
  top: 5vh;
  left: 5vh;
  opacity: 0.5;
  @media only screen and (max-width: 768px) {
    /* For mobile phones: */
    font-size: 2.5rem;
  }
`

function ThemeSwitcher (props) {
  const handleClick = (e) => {
    e.preventDefault()
    props.changeTheme()
  }

  return (
    <Link href="#" onClick={(e) => handleClick(e)}>
      <Icon icon={props.theme.themeIconToShow} />
    </Link>
  )
}

ThemeSwitcher.propTypes = {
  changeTheme: PropTypes.func.isRequired,
  theme: PropTypes.object
}

export default withTheme(ThemeSwitcher)
