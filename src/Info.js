import { Icon } from '@iconify-icon/react'
import React from 'react'
import styled from 'styled-components'

const Link = styled.a`
  position: absolute;
  font-size: 2rem;
  color: ${props => props.theme.icons};
  bottom: 5vh;
  right: 5vh;
  opacity: 0.5;
  @media only screen and (max-width: 768px) {
    /* For mobile phones: */
    font-size: 1.5rem;
  }
`

function Info () {
  return (
    <Link href="https://www.github.com/leobel96/The-Homepage/blob/master/README.md">
      <Icon icon="material-symbols:info-rounded"/>
    </Link>
  )
}

export default Info
