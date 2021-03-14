import React, {useContext} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'
// import { AuthPage } from '../pages/AuthPage'

export const Navbar = () => {
  const auth = useContext(AuthContext)
  const history = useHistory()

  const logoutHandler = event => {
    event.preventDefault()
    auth.logout()
    history.push('/')
  }

  return (
    <nav>
      <div className="nav-wrapper blue">
        <a href="/" className="brand-logo">OwnLibrary</a>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li><NavLink to="/search">Search</NavLink></li>
          <li><NavLink to="/account/">Account</NavLink></li>
          <li><NavLink to="/create">Create</NavLink></li>
          <li><a to="/" onClick={logoutHandler}>Logout</a></li>
        </ul>
      </div>
    </nav>
  )
}