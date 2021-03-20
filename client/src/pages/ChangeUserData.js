import React, {useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
// import {AuthContext} from "../context/AuthContext"
// import {browserHistory} from 'react-router'
import {Redirect} from "react-router-dom"


export const ChangeUserData = ({userData, userId}) => {
  const message = useMessage()
  const {loading, request, error, clearError} = useHttp()
  const [status, setStatus] = useState()
  const [form, setForm] = useState({
    name: userData.name,
    surname: userData.surname,
    country: userData.country,
    city: userData.city,
    street: userData.street,
    home: userData.home,
    flat: userData.flat,
    country_code: userData.country_code,
    operator_code: userData.operator_code,
    number: userData.number,
    email: userData.email,
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

  const changeUserDataHandler = async () => {
    try {
      const data = await request(`/api/account/${userId}/change`, 'PUT', {...form, userId})

      if(Math.round(data.status / 100) === 5) {
        return
      } else if (Math.round(data.status / 100) === 4) {
        message(data.body.message)
        return
      } else if (Math.round(data.status / 100) === 2) {
        message(data.body.message)
        if (data.status) {
          setStatus(true)
        }
      }
    } catch(e) {}
  }

  if (!userData || !userId || status) {
    return (
      <Redirect to="/search" />
    )
  } else {
    return (
      <div className="row">
        <div className="col s6 offset-s3">
          <div className="card blue darken-1">
            <div className="card-content white-text">
              <span className="card-title">Change user information</span>
              <div>
                <div className="registr__wrapper">
                  <div className="input-field">
                    <input 
                      className="yellow-input"
                      type="text"
                      placeholder="Ivan" 
                      value={form.name}
                      id="name" 
                      name="name"
                      onChange={changeHandler} />
                      <label htmlFor="name">Name</label>
                  </div>
                  <div className="input-field">
                    <input 
                      className="yellow-input"
                      type="text"
                      value={form.surname}
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
                    value={form.country}
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
                    value={form.city}
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
                      value={form.street}
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
                      value={form.home}
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
                    value={form.flat}
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
                      value={form.operator_code}
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
                      value={form.number}
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
                    value={form.email}
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
                      placeholder="Confirm password" 
                      id="password"
                      name="password" 
                      onChange={changeHandler}/>
                      <label htmlFor="password">Confirm password</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-action">
              <button
                onClick={changeUserDataHandler}
                className="btn grey lighten-1 black-text"
                disabled={loading}
                >
                Save
              </button> 
            </div>
          </div>
        </div>
      </div>
    )
  }
}