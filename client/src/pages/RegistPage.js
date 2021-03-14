import React, {useEffect, useState, useContext} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import {AuthContext} from "../context/AuthContext"

export const RegistPage = () => {
  const auth = useContext(AuthContext)
  const message = useMessage()
  const {loading, request, error, clearError} = useHttp()
  const [form, setForm] = useState({
    name: '',
    surname: '',
    adress: '',
    email: '',
    password: '',
    confirm_password: ''
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

  const registerHandler = async () => {
    try {
      const data = await request('/api/auth/register', 'POST', {...form})
      auth.login(data.token, data.userId)
    } catch(e) {}
  }

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title">Registretion</span>
            <div>
            <div className="input-field">
                <input 
                  className="yellow-input"
                  type="text"
                  placeholder="Enter your name" 
                  id="name" 
                  name="name"
                  onChange={changeHandler}/>
                  <label htmlFor="name">Name</label>
              </div>
              <div className="input-field">
                <input 
                  className="yellow-input"
                  type="text"
                  placeholder="Enter your surname" 
                  id="surname" 
                  name="surname"
                  onChange={changeHandler}/>
                  <label htmlFor="surname">Surname</label>
              </div>
              <div className="input-field">
                <input 
                  className="yellow-input"
                  type="text"
                  placeholder="Enter your adress" 
                  id="adress" 
                  name="adress"
                  onChange={changeHandler}/>
                  <label htmlFor="adress">Adress</label>
              </div>
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
              <div className="input-field">
                <input 
                  className="yellow-input"
                  type="password"
                  placeholder="Confirm password" 
                  id="confirm_password"
                  name="confirm_password" 
                  onChange={changeHandler}/>
                  <label htmlFor="confirm_password">Confirm password</label>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button
              onClick={registerHandler}
              className="btn grey lighten-1 black-text"
              disabled={loading}
              >
              Signup
            </button> 
          </div>
        </div>
      </div>
    </div>
  )
}