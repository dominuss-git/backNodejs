import React, {useState, useEffect, useContext} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'
import Book from '../components/Books'
import { Loader } from '../components/Loader'
import { AuthContext } from '../context/AuthContext'

export const SearchPage = () => {
  const context = useContext(AuthContext)
  const message = useMessage()
  const {loading, request, error, clearError} = useHttp()
  const [status, setStatus] = useState(false) 
  const [page, setPage] = useState(1)
  const [form, setForm] = useState({
    name: '',
    genre: '',
    authors: ''
  })
  const [books, setBooks] = useState([])

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  const changeHandler = (event) => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const searchHandler = async () => {
    try {
      const data = await request('/api/book/search', 'POST', {...form})
      if(data === null) {
        return
      } 
      setBooks(data)
      setPage(1)

    } catch(e) {}
  }

  const iter = (val) => {
    let a = []
    for (let i = 0; i < val; i += 1) {
      a[i] = i + 1
    }
    return a
  }

  const switchPage = val => {
    console.log(val)
    setPage(Number(val.target.innerHTML))
  }

  useEffect(() => {
    if (!status) {
      setStatus(true)
      searchHandler()
    }
  },[books])

  return (
    <div className="wrapper">
        <div className="card blue darken-1 wrapper__search">
          <div className="card-content white-text">
            <span className="card-title">Search</span>
            <div>
              <div className="input-field">
                <input 
                  className="yellow-input"
                  type="text"
                  placeholder="Book" 
                  id="book" 
                  name="book"
                  onChange={changeHandler}/>
              </div>
              <div className="input-field">
                <input 
                  className="yellow-input"
                  type="text"
                  placeholder="Genre" 
                  id="genre" 
                  name="genre"
                  onChange={changeHandler}/>
              </div>
              <div className="input-field">
                <input 
                  className="yellow-input"
                  type="text"
                  placeholder="Author" 
                  id="authors" 
                  name="authors"
                  onChange={changeHandler}/>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button 
              className="btn"
              disabled={loading}
              onClick={searchHandler}>
                Search
            </button>
          </div>
        </div>
        <div className="wrapper__card">
          {books.books !== undefined ? 
            books.books.map((book, i) => {
              if (page * 5 > i && (page - 1) * 5 <= i) {
              return (
                <Book 
                  subscribers={book.subscribers}
                  userId={context.userId}
                  bookId={book._id}
                  key={i} name={book.name} 
                  authors={[book.authors]} 
                  genre={book.genre}
                  data={book.data} />
                )      
              }
            }) : <Loader /> }  
          {books.books !== undefined ? 
            <ul className="pagination pages">
              {
                iter(Math.ceil(books.books.length / 5)).map((val, i) => {
                  
                    if (page === val) {
                      return (
                        <li className="active pages__space" key={i}>
                          <a key={i} onClick={switchPage}>{val}</a>
                        </li>
                      )
                    } else {
                      return (
                        <li className="waves-effect pages__space" key={i}>
                          <a key={i} onClick={switchPage}>{val}</a>
                        </li>
                      )
                    }
                })
              }
          
            </ul> 
            : ""}
        </div>
    </div>
  )
}