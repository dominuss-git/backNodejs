import React, {useContext, useEffect, useState} from 'react'
import {AuthContext} from '../context/AuthContext'
import {useHttp} from '../hooks/http.hook'
import {Loader} from '../components/Loader'
import {Book} from '../components/Book'
import {useHistory} from "react-router-dom"
import { ChangeUserData } from './ChangeUserData'
import { useMessage } from '../hooks/message.hook'

export const AcountPage = () => {
  const context = useContext(AuthContext)
  const {request, loading} = useHttp()
  const [userData, setUserData] = useState()
  const message = useMessage()
  const [isChange, setIsChange] = useState(false)
  const history = useHistory()
  
  const getUserData = async () => {
    try {
      const data = await request(`/api/account/${context.userId}`, 'GET', null, {
        Authorization: `Bearer ${context.token}`
      })
      if(Math.round(data.status / 100) === 5) {
        return
      } else if (Math.round(data.status / 100) === 4) {
        return
      } else if (Math.round(data.status / 100) === 2) {
        setUserData(data.body)
      }

    } catch(e) {}
  }

  const deleteHandler = async () => {
    try {
      const data = await request(`/api/account/${context.userId}/delete`, 'DELETE', null)

      console.log(data.status)

      if(Math.round(data.status / 100) === 5) {
        return
      } else if (Math.round(data.status / 100) === 4) {
        message(data.body.message)
        return
      } else if (Math.round(data.status / 100) === 2) {
        context.logout()
        history.push('/')
      }

    } catch(e) {}
  }

  const changeHandler = () => {
    setIsChange(true)
  }

  useEffect(() => {
    setTimeout(() => {
      if (!userData && !loading) {
        getUserData()
      }
    }, 2000)
  },[userData, loading, getUserData])
  
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
              onClick={deleteHandler}
              disabled={loading}>  
              DELETE
            </button>
          </div>
        </div>
    )
  } else if (isChange) {
    history.push(`/account/${context.userId}/change`)
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