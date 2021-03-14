import React, {useEffect, useState, useContext} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from "../context/AuthContext"
import {NavLink} from "react-router-dom"


export const AuthPage = () => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, request, error, clearError} = useHttp()
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  useEffect(() => {
    window.M.updateTextFields()
  }, [])

  const changeHandler = (event) => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const loginHandler = async () => {
    try {
      const data = await request('/api/auth/login', 'POST', {...form})
      console.log(data.userId)
      auth.login(data.token, data.userId)
    } catch(e) {}
  }

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title">Authorisation</span>
            <div>
              <div className="input-field">
                <input 
                  className="yellow-input"
                  type="text"
                  placeholder="Enter email" 
                  id="email" 
                  name="email"
                  onChange={changeHandler}/>
                  <label htmlFor="email">Email</label>
              </div>
              <div className="input-field">
                <input 
                  className="yellow-input"
                  type="password"
                  placeholder="Enter password" 
                  id="password"
                  name="password" 
                  onChange={changeHandler}/>
                  <label htmlFor="password">Password</label>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button 
              className="btn yellow darken-4"
              onClick={loginHandler}
              disabled={loading}>
                Signin
              </button>
            <NavLink
              to="/registr" 
              className="btn grey lighten-1 black-text"
              >
              Signup
            </NavLink> 
          </div>
        </div>
      </div>
    </div>
  )
}