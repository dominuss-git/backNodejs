import React, {useState, useEffect} from 'react'
import {useHttp} from '../hooks/http.hook'
import {useMessage} from '../hooks/message.hook'


export const NewBookPage = () => {
  const message = useMessage()
  const {loading, request, error, clearError} = useHttp()
  const [form, setForm] = useState({
    name: '',
    genre: '',
    authors: '',
    data: '',
    count: ''
  })

  useEffect(() => {
    message(error)
    clearError()
  }, [error, message, clearError])

  const changeHandler = (event) => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const AddHandler = async () => {
    try {
      const data = await request('/api/books/create', 'POST', {...form})
      
      if(Math.round(data.status / 100) === 5) {
        return
      } 

      message(data.body.message)
    } catch(e) {}
  }

  return (
    <div className="row">
        <div className="s6 offset-s3 card__wrapper">
          <div className="card blue darken-1">
            <div className="card-content white-text">
              <span className="card-title">Add new book</span>
              <div>
                <div className="input-field">
                  <input 
                    className="yellow-input"
                    type="text"
                    placeholder="Bookname" 
                    id="name" 
                    name="name"
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
                <div className="input-field">
                  <input 
                    className="yellow-input"
                    type="text"
                    placeholder="Release data" 
                    id="data" 
                    name="data"
                    onChange={changeHandler}/>
                </div>
                <div className="input-field">
                  <input 
                    className="yellow-input"
                    type="number"
                    placeholder="Count" 
                    id="count" 
                    name="count"
                    onChange={changeHandler}/>
                </div>
              </div>
            </div>
            <div className="card-action">
              <button 
                className="btn"
                disabled={loading}
                onClick={AddHandler}>
                  Add
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}