import React, {useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import { Loader } from './Loader'


export const Book = ({bookId, userId}) => {
  const [status, setStatus] = useState(false)
  const message = useMessage()
  const {loading, request} = useHttp()
  const [book, setBook] = useState()
  const [isSubscribe, setisSubscribe] = useState(true)

  const getBook = async (bookId) => {
    try {
      const data = await request('/api/book/get', 'POST', {bookId})
      console.log(data)
      setBook(data)
    } catch(e) {}
  }

  useEffect(() => {
    if(!status) {
      setStatus(true)
      getBook(bookId)
    }
  },[status, setStatus, bookId])

  const subscribeHadler = async () => {
    const data = await request('/api/book/subscribe', 'POST', {isSubscribe: false, bookId, userId})
    setisSubscribe(true)
    message(data.message)
  }
  const unsubscribeHadler = async () => {
    console.log(userId, bookId)
    const data = await request('/api/book/unsubscribe', 'POST', {isSubscribe : true, bookId, userId})
    setisSubscribe(false)
    message(data.message)
  }

  if (book) {
    return (
      <div>
        <div className="book">
          <div className="book__name">
            {book.name}
          </div>
        </div>
        <div className="book__wrapper">
          <div className="card__wrapper">
            <div className="">
              <b>Genre</b> : {book.genre}
            </div>
            <div className="">
              <b>Authors</b> : {book.genre}
            </div>
          </div>
          {
            isSubscribe ?
            <button 
            className="btn book__btn"
            onClick={unsubscribeHadler}
            disabled={loading}>
            Unsubscribe
          </button>
          :
          <button 
            className="btn book__btn"
            onClick={subscribeHadler}
            disabled={loading}>
            Subscribe
          </button>
          }
        </div>
      </div>

    )
  } else {
    return (
      <Loader />
    )
  }
}