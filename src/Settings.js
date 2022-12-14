import { Icon } from '@iconify-icon/react'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { withTheme } from 'styled-components'
import ccTLD from './ccTLD.json'

const Open = styled.a`
  position: absolute;
  font-size: 3rem;
  color: ${props => props.theme.icons};
  top: 5vh;
  right: 5vh;
  opacity: 0.5;
  @media only screen and (max-width: 768px) {
    /* For mobile phones: */
    font-size: 2.5rem;
  }
`

const Close = styled.a`
  font-size: 3rem;
  color: ${props => props.theme.icons};
  align-self: flex-end;
  opacity: 0.5;
  @media only screen and (max-width: 768px) {
    /* For mobile phones: */
    font-size: 2.5rem;
  }
`

const Menu = styled.div`
  position: absolute;
  top: 5vh;
  right: 5vh;
  display: flex;
  flex-direction: column;
  font-size: 2rem;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.menu};
  z-index: 99;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  @media only screen and (max-width: 768px) {
    /* For mobile phones: */
    font-size: 1rem;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
`

const Entry = styled.label`
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
`

function Settings (props) {
  return (
    <>
      <Open href="#" onClick={(e) => { e.preventDefault(); props.setMenuIsOpen(true) }}>
        <Icon icon="ic:round-settings" />
      </Open>
      {props.menuIsOpen &&
        <Menu>
          <Close href="#" onClick={(e) => { e.preventDefault(); props.setMenuIsOpen(false) }}>
            <Icon icon="mingcute:close-circle-fill" />
          </Close>
          <Entry>
            Choose a domain:
            <select onChange={e => props.setDomain(e.target.value)} defaultValue={props.currDomain}>
              {
                ccTLD.map((item) =>
                <option value={item.domain} key={item.domain}>{item.name}</option>
                )
              }
            </select>
          </Entry>
        </Menu>
      }
    </>
  )
}

Settings.propTypes = {
  theme: PropTypes.object,
  setDomain: PropTypes.func.isRequired,
  currDomain: PropTypes.string,
  setMenuIsOpen: PropTypes.func,
  menuIsOpen: PropTypes.bool.isRequired
}

export default withTheme(Settings)
