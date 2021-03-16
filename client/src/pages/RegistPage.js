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
    country: '',
    city: '',
    street: '',
    home: '',
    flat: '',
    country_code: '+375',
    operator_code: '',
    number: '',
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
              <div className="registr__wrapper">
                <div className="input-field">
                  <input 
                    className="yellow-input"
                    type="text"
                    placeholder="Ivan" 
                    id="name" 
                    name="name"
                    onChange={changeHandler}/>
                    <label htmlFor="name">Name</label>
                </div>
                <div className="input-field">
                  <input 
                    className="yellow-input"
                    type="text"
                    placeholder="Ivanov" 
                    id="surname" 
                    name="surname"
                    onChange={changeHandler}/>
                    <label htmlFor="surname">Surname</label>
                </div>
              </div>
              <div className="input-field">
                <input 
                  className="yellow-input"
                  type="text"
                  placeholder="Belarus" 
                  id="country" 
                  name="country"
                  onChange={changeHandler}/>
                  <label htmlFor="country">Country</label>
              </div>
              <div className="input-field">
                <input 
                  className="yellow-input"
                  type="text"
                  placeholder="Minsk" 
                  id="city" 
                  name="city"
                  onChange={changeHandler}/>
                  <label htmlFor="city">City</label>
              </div>
              <div className="registr__wrapper">
                <div className="input-field">
                  <input 
                    className="yellow-input"
                    type="text"
                    placeholder="Yakuba Kolasa" 
                    id="street" 
                    name="street"
                    onChange={changeHandler}/>
                    <label htmlFor="street">Street</label>
                </div>
                <div className="input-field small">
                  <input 
                    className="yellow-input"
                    type="number"
                    placeholder="1" 
                    id="home" 
                    name="home"
                    onChange={changeHandler}/>
                    <label htmlFor="home">Home</label>
                </div>
                <div className="input-field small">
                <input 
                  className="yellow-input"
                  type="number"
                  placeholder="1" 
                  id="flat" 
                  name="flat"
                  onChange={changeHandler}/>
                  <label htmlFor="flat">Flat</label>
                </div>
              </div>
              <div className="registr__wrapper">
                <div className="input-field small">
                  <input 
                    value={form.country_code}
                    className="yellow-input"
                    type="text"
                    placeholder="code" 
                    id="contry_code" 
                    name="country_code"
                    onChange={changeHandler}/>
                    <label htmlFor="country_code">country</label>
                </div>
                <div className="input-field small">
                  <input 
                    className="yellow-input"
                    type="number"
                    placeholder="00" 
                    id="operator_code" 
                    name="operator_code"
                    onChange={changeHandler}/>
                    <label htmlFor="operator_code">operator</label>
               </div>
                <div className="input-field">
                  <input 
                    className="yellow-input"
                    type="number"
                    placeholder="1234567" 
                    id="number" 
                    name="number"
                    onChange={changeHandler}/>
                    <label htmlFor="number">Number</label>
                </div>
              </div>
              <div className="input-field">
                <input 
                  className="yellow-input"
                  type="text"
                  placeholder="ivanivan@gmail.com" 
                  id="email" 
                  name="email"
                  onChange={changeHandler}/>
                  <label htmlFor="email">Email</label>
              </div>
              <div className="registr__wrapper">
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