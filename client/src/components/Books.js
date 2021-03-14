import React, { useState, useEffect } from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'

function Book({name, authors, genre, data, bookId, userId, subscribers}) {
  const message = useMessage()
  const [isDeleted, setisDeleted] = useState(false)

  const checkSubscribe = () => {
    // console.log(subscribers[0] === context.userId)
    if (subscribers !== null && subscribers != undefined) {
      for (let val of subscribers) {
        if (userId === val) {
          return true
        }
      }
    } 
    return false
  }

  const [isSubscribe, setisSubscribe] = useState(null)

  if (isSubscribe === null) {
    console.log(checkSubscribe())
    setisSubscribe(checkSubscribe())
  }

  useEffect(() => {
    console.log(isSubscribe)
  },[isSubscribe])

  const {loading, request, error, clearError} = useHttp()
  
  const subscribeHadler = async () => {
    const data = await request('/api/book/subscribe', 'POST', {isSubscribe, bookId, userId})
    setisSubscribe(true)
    message(data.message)
  }
  const unsubscribeHadler = async () => {
    const data = await request('/api/book/unsubscribe', 'POST', {isSubscribe, bookId, userId})
    setisSubscribe(false)
    message(data.message)
  }
  const deleteHandler = async () => {
    const data = await request('/api/book/delete', 'POST', {bookId, userId})
    setisSubscribe(false)
    setisDeleted(true)
    message(data.message)
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
          <ul> <b>Release data</b> : {data}
          </ul>
          <button 
            onClick={deleteHandler}
            disabled={loading}
            className="btn">
            DELETE
          </button>
            &nbsp;
          {isSubscribe ? 
            <button 
              className="btn"
              disabled={loading}
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
        </div>
      </div>
    )
  }
}

export default Book;