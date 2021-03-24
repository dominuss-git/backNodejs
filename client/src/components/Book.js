import React, {useContext, useEffect, useState} from 'react'
import { AuthContext } from '../context/AuthContext'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import { Loader } from './Loader'


export const Book = ({bookId, userId}) => {
  const [status, setStatus] = useState(false)
  const message = useMessage()
  const {loading, request} = useHttp()
  const [book, setBook] = useState()
  const [isSubscribe, setisSubscribe] = useState(true)
  const {token} = useContext(AuthContext)


  const getBook = async (bookId) => {
    try {
      const data = await request(`/api/books/${bookId}`, 'GET', null, {
        Authorization : `Bearer ${token}`
      })

      console.log(data)

      if (Math.round(data.status / 100) === 5) {
        return
      } else if (Math.round(data.status / 100) === 4) {
        return
      } else if (Math.round(data.status / 100) === 2) {
        console.log(data)
        setBook(data.body)
      }
    } catch(e) {}
  }

  useEffect(() => {
    if(book === undefined) {
      getBook(bookId)
    }
  },[book, bookId, getBook])

  const subscribeHadler = async () => {
    const data = await request('/api/books/subscribe', 'PUT', {isSubscribe: false, bookId, userId})

    if(Math.round(data.status / 100) === 5) {
      return
    } else if (Math.round(data.status / 100) === 4) {
      return
    } else if (Math.round(data.status / 100) === 2) {
      setisSubscribe(true)
    }
    message(data.body.message)
  }

  const unsubscribeHadler = async () => {
    const data = await request('/api/books/unsubscribe', 'PUT', {isSubscribe: true, bookId, userId})

    if(Math.round(data.status / 100) === 5) {
      return
    } else if (Math.round(data.status / 100) === 4) {
      return
    } else if (Math.round(data.status / 100) === 2) {
      setisSubscribe(false)
      message(data.body.message)
    }
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
              <b>Authors</b> : 
                <ul>
                  {
                    book.authors.map((val, i) => {
                      return (
                        <li key={i}>{val}</li>
                      )
                    })
                  }
                </ul>
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