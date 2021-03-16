import React, {useContext, useEffect, useState} from 'react'
import {AuthContext} from '../context/AuthContext'
import {useHttp} from '../hooks/http.hook'
import {Loader} from '../components/Loader'
import {Book} from '../components/Book'
import {Link} from "react-router-dom"
import { ChangeUserData } from './ChangeUserData'

export const AcountPage = () => {
  const context = useContext(AuthContext)
  const {request, loading} = useHttp()
  const [userData, setUserData] = useState()
  const [status, setStatus] = useState(false)
  const [isChange, setIsChange] = useState(false)
  
  const getUserData = async () => {
    try {
      const data = await request('/api/usr/get', 'POST', {userId :context.userId})
      if(data === null) {
        return
      } 
      setUserData(data)

    } catch(e) {}
  }

  const changeHandler = () => {
    setIsChange(true)
  }

  useEffect(() => {
    if (!status) {
      setStatus(true)
      getUserData()
    }
  },[status, setStatus, getUserData])
  
  if (userData && !isChange) {
    return (
        <div className="card blue">
          <div className="box">
            <b className="box__title">email</b>
            <span className="box__value">{userData.email}</span>
          </div>
          <div className="box">
            <b className="box__title">Name</b>
            <span className="box__value">{userData.name}</span>
          </div>
          <div className="box">
            <b className="box__title">Surname</b>
            <span className="box__value">{userData.surname}</span>
          </div>
          <div className="box">
            <b className="box__title">Country</b>
            <span className="box__value">{userData.country}</span>
          </div>
          <div className="box">
            <b className="box__title">City</b>
            <span className="box__value">{userData.city}</span>
          </div>
          <div className="box">
            <b className="box__title">Street</b>
            <span className="box__value">
              {userData.street}
              &ensp;
              {userData.home}, 
              &ensp;
              {userData.flat}
              </span>
          </div>
          <div className="box">
            <b className="box__title">Number</b>
            <span className="box__value">
              {userData.country_code}
              &ensp;
              ({userData.operator_code})
              &ensp;
              {userData.number}
              </span>
          </div>
          <div className="box">
            <b className="box__title">books</b>
            <div className="box__value">
              {userData.books.map((val, i) => {
                return (
                  <Book key={i} bookId={val} userId={context.userId}/>
                )
              })
              }
            </div>
          </div>
          <div className="card-action right">
            <button 
              className="btn yellow darken-4"
              disabled={isChange}
              onClick={changeHandler}>  
              Change
            </button >
            &ensp;
            <button 
              className="btn red darken-4"
              disabled={loading}>  
              DELETE
            </button>
          </div>
        </div>
    )
  } else if (isChange) {
    return (
      <div>
        <ChangeUserData userData={userData} userId={context.userId} />
      </div> 
    )
  } else {
    return (
      <Loader />
    )
  }
}