import React, { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'

function Book({name, 
  authors, 
  genre, 
  data, 
  bookId, 
  user_books, 
  userId, 
  subscribers
  }) {
  const message = useMessage()
  const [isDeleted, setisDeleted] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const {loading, request} = useHttp()
  const context = useContext(AuthContext)

  const checkSubscribe = () => {
    if (subscribers !== null && subscribers !== undefined) {
      for (let val of subscribers) {
        for (let book of user_books) {
          if (book === val) {
            return true
          }
        }
      }
    } 
    return false
  }

  const [isSubscribe, setisSubscribe] = useState(null)

  if (isSubscribe === null) {
    setisSubscribe(checkSubscribe())
  }
  
  const subscribeHadler = async () => {
    const data = await request('/api/books/subscribe', 'PUT', {isSubscribe, bookId, userId})
    if(Math.round(data.status / 100) === 5) {
      return
    } else if (Math.round(data.status / 100) === 4) {
      message(data.body.message)
      return
    } else if (Math.round(data.status / 100) === 2) {
      setIsActive(data.body.isActive)
      setisSubscribe(data.body.isActive)
      message(data.body.message)
    }
  }
  const unsubscribeHadler = async () => {
    const data = await request('/api/books/unsubscribe', 'PUT', {isSubscribe, bookId, userId})
    if(Math.round(data.status / 100) === 5) {
      return
    } else if (Math.round(data.status / 100) === 4) {
      message(data.body.message)
      return
    } else if (Math.round(data.status / 100) === 2) {
      setisSubscribe(false)
      message(data.body.message)
    }
  }
  const deleteHandler = async () => {
    const data = await request(`/api/books/${bookId}`, 'DELETE', null, {
      Authorization: `Bearer ${context.token}`
    })
    if(Math.round(data.status / 100) === 5) {
      return
    } else if (Math.round(data.status / 100) === 4) {
      return
    } else if (Math.round(data.status / 100) === 2) {
      setisSubscribe(false)
      setisDeleted(true)
      message(data.body.message)
    }
  }

  if(isDeleted) {
    return ("")
  } else {
    return ( 
      <div className="card blue darken-1">
        <div className="book">
          <b className="book__name">{name}</b>
        </div>
        <div className="book__card">
          <div><b>Genre</b> : {genre}</div>
          <ul>  <b>Authors</b> :
            {authors[0].map((author, index) => {
              return (
                <li key={index}>{author}</li>
              )  
            })}
          </ul>
          <ul> <b>Release data</b> : {new Date(data).getDate()}-{new Date(data).getMonth() + 1}-{new Date(data).getFullYear()}
          </ul>
          {isSubscribe ? 
            <button 
              className="btn"
              disabled={loading}
              disabled={!isActive}
              onClick={unsubscribeHadler}>
              Unsubscribe
            </button> :  
            <button 
              className="btn"
              disabled={loading}
              onClick={subscribeHadler}>
              Subscribe
            </button>
          }
          &nbsp;
          <button 
            onClick={deleteHandler}
            disabled={loading}
            className="btn red darken-4">
            DELETE
          </button>
        </div>
      </div>
    )
  }
}

export default Book;