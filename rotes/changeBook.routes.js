// const express = require('express')
const {Router} = require('express')
const Book = require('../models/Book')
const User = require('../models/User')
const SubscribedBook = require('../models/SubscribedBook')
// const mongoose = require('mongoose')
// const moment = require('moment')

const router = Router()

router.post('/add', async (req, res) => {
  try {
    const {name, genre, authors, data, count}  = req.body

    if (name === '' || name[0] === ' ') {
      return res.status(400).json({message: "You must be enter book name"})
    } else if (genre === '' || genre[0] === ' ') {
      return res.status(400).json({message: "You must be enter genre"})
    } else if (data === '' || data[0] === ' ') {
      return res.status(400).json({message: "You must be enter release data"})
    } else if (authors === '' || authors[0] === ' ') {
      return res.status(400).json({message: "You must be enter author/authors"})
    } else if (count === '' || count[0] === '') {
      return res.status(400).json({message: "You must be enter books count"})
    }

    const author = authors.split(',')  

    let date = new Date(data)
    // date = date.toLocaleString('en-US', options)

    if (!date.getMonth()) {
      return res.status(400).json({ message: 'Invalid date'})
    }

    const book = new Book({
      name : name, 
      genre : genre, 
      authors : author,
      data : date,
      count: Number(count)
    })

    await book.save()

    res.status(201).json({message: "Book add"})
  } catch(e) {
    res.status(500).json({ message : "Error"})
  }
})

router.post('/subscribe', async (req, res) => {
  try {
    const {isSubscribe, bookId, userId}  = req.body
    const user = await User.findById(userId)
    const book = await Book.findById(bookId)

    if (book.count === book.subscribers.length) {
      return res.json({message: "not available", isActive: false})
    }
    
    if (book === null) {
      return res.status(201).json({message: "book is deleted", isActive: false})
    }

    if (!isSubscribe) {
    
      const subscribedBook = await SubscribedBook({
        bookId: bookId,
        userId: userId
      })

      await subscribedBook.save()

      user.books[user.books.length] = subscribedBook.id
      book.subscribers[book.subscribers.length] = subscribedBook.id


      User.findOneAndUpdate({_id: userId}, {books : user.books}, {upset:true}, function(err, docs) {
        if(err) {
          res.status(500).json({message : "failed to subscribe", isActive: false})
      }

        Book.findOneAndUpdate({_id: bookId}, {subscribers: book.subscribers}, {upsert: true}, function(err, docs) {
          if(err) {
            res.status(500).json({message : "failed to subscribe", isActive: false})
          }
        })
      })
    } else {
      res.status(500).json({message : "you already subsribe", isActive: false})
    }

    res.status(201).json({message: "subscribed", isActive: true})
  } catch(e) {
    res.status(500).json({ message : "Error"})
  }
})

router.post('/unsubscribe', async (req, res) => {
  try {
    const {isSubscribe, bookId, userId}  = req.body


    if (isSubscribe) {

      let subscribedBook = await SubscribedBook.findById(bookId)
      
      if (subscribedBook === null) {
        subscribedBook = await SubscribedBook.findOne({
          bookId: bookId,
          userId: userId
        }, function(err, docs) {
          if (err) {
            return res.json({ message: "failed unsubscribe"})
          }
        })
      }
  
      const user = await User.findOne({books: subscribedBook.id})
      const book = await Book.findOne({subscribers: subscribedBook.id})
  
      if (book === null) {
        return res.status(201).json({message: "book is deleted"})
      }

      for (let i in user.books) {
        if (user.books[i].equals(subscribedBook.id)) {
          user.books.splice(i, 1)
          break
        }
      }

      for (let i in book.subscribers) {
        if (book.subscribers[i].equals(subscribedBook.id)) {
          book.subscribers.splice(i, 1)
          break
        }
      }
      
      await subscribedBook.remove()

      User.findOneAndUpdate({_id: userId}, {books : user.books}, {upset:true}, function(err, docs) {
        if(err) {
          res.status(500).json({message : "failed to unsubscribe"})
        }

        Book.findOneAndUpdate({_id: bookId}, {subscribers: book.subscribers}, {upsert: true}, function(err, docs) {
          if(err) {
            res.status(500).json({message : "failed to unsubscribe"})
          }
        })
      })

    } else {
      res.status(500).json({message : "you are not subscribe"})
    }

    res.status(201).json({message: "unsubscribed"})
  } catch(e) {
    res.status(500).json({ message : "Error"})
  }
})

router.post('/delete', async (req, res) => {
  try {
    const {bookId, userId}  = req.body
    const book = await Book.findById(bookId)

    // console.log(book)

    book.subscribers.map(async (val, i) => {
      let subscriber = await SubscribedBook.findById(val)
      let user = await User.findById(subscriber.userId)


      for (let i in user.books) {
        if (String(user.books[i]) === String(val)) {
          user.books.splice(i, 1)
          break
        }
      }

      User.findOneAndUpdate({_id: user._id}, {books : user.books}, {upset:true}, function(err, docs) {
        if(err) {
          res.status(500).json({message : "failed to delete"})
        }
      })

      await subscriber.remove()
    })

    await book.remove()

    return res.status(201).json({message: "book delete"})

  } catch(e) {
    res.status(500).json({ message : "Error"})
  }
})

module.exports = router