import React, {useContext, useEffect, useState} from 'react'
import {AuthContext} from '../context/AuthContext'
import {useHttp} from '../hooks/http.hook'
import {Loader} from '../components/Loader'
import {Book} from '../components/Book'

export const AcountPage = () => {
  const context = useContext(AuthContext)
  const {request} = useHttp()
  const [userData, setUserData] = useState()
  const [status, setStatus] = useState(false)
  
  const getUserData = async () => {
    try {
      const data = await request('/api/usr/get', 'POST', {userId :context.userId})
      if(data === null) {
        return
      } 
      setUserData(data)

    } catch(e) {}
  }

  useEffect(() => {
    if (!status) {
      setStatus(true)
      getUserData()
    }
  },[status, setStatus, getUserData])
  
  if (userData) {
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
            <b className="box__title">Adress</b>
            <span className="box__value">{userData.adress}</span>
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
        </div>
    )
  } else {
    return (
      <Loader />
    )
  }
}