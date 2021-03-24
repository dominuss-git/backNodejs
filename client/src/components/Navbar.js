import React, {useContext} from 'react'
import {NavLink, useHistory} from 'react-router-dom'
import {AuthContext} from '../context/AuthContext'

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
        <a href="/" className="brand-logo">&#160;OwnLibrary</a>
        <div className="navbar right"> Menu
          <ul className="navbar__fields yellow darken-4">
            <li><NavLink to="/books">Search</NavLink></li>
            <li><NavLink to={"/account/" + auth.userId}>Account</NavLink></li>
            <li><NavLink to="/books/create">Create</NavLink></li>
            <li><a to="/" onClick={logoutHandler}>Logout</a></li>
          </ul>
        </div>
        <ul id="nav-mobile" className="right hide-on-med-and-down navnar__big">
          <li><NavLink to="/books">Search</NavLink></li>
          <li><NavLink to={"/account/" + auth.userId}>Account</NavLink></li>
          <li><NavLink to="/books/create">Create</NavLink></li>
          <li><a to="/" onClick={logoutHandler}>Logout</a></li>
        </ul>
      </div>
    </nav>
  )
}