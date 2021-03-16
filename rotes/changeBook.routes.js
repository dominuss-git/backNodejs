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
      const subscribedBook = new SubscribedBook({
        bookId : userId,
      }) 

      user.books[user.books.length] = bookId //subscribedBook.id
      book.subscribers[book.subscribers.length] = userId

      // await subscribedBook.save()


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
    // res.status(201).json({message: "Book add"})
    res.status(201).json({message: "subscribed", isActive: true})
  } catch(e) {
    res.status(500).json({ message : "Error"})
  }
})

router.post('/unsubscribe', async (req, res) => {
  try {
    const {isSubscribe, bookId, userId}  = req.body
    // const subscribedBook = await SubscribedBook.findOneAndRemove({bookId: bookId}, function(err, docs) {
    //   if (err) {
    //     return res.json({ message: "failed unsubscribe"})
    //   }
    // })
    const user = await User.findById(userId)
    const book = await Book.findById(bookId)

    // console.log(subscribedBook)

    if (book === null) {
      return res.status(201).json({message: "book is deleted"})
    }

    if (isSubscribe) {
      for (let i in user.books) {
        if (user.books[i].equals(bookId)) {
          user.books.splice(i, 1)
          break
        }
      }

      for (let i in book.subscribers) {
        console.log(book.subscribers[i].equals(userId))
        if (book.subscribers[i].equals(userId)) {
          book.subscribers.splice(i, 1)
          break
        }
      }

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
    const user = await User.find({})

    user.map((val, j) => {
      for (let i in val.books) {
        if (val.books[i] === bookId) {
          user[j].books.splice(i, 1)
          break
        }
      }
    })
    for (let i in user) {
      User.findOneAndUpdate({_id: user[i]._id}, {books : user[i].books}, {upset:true}, function(err, docs) {
        if(err) {
          res.status(500).json({message : "failed to subscribe"})
        }
      })
    }

    Book.findByIdAndRemove(bookId, function(err, docs) {
      if(err) {
        return res.status(400).json({message: "failed delete"})
      }
      return res.status(201).json({message: "book delete"})
    })
    

      // User.findOneAndUpdate({_id: userId}, {books : user.books}, {upset:true}, function(err, docs) {
      //   if(err) {
      //     res.status(500).json({message : "failed to unsubscribe"})
      //   }

      //   Book.findOneAndUpdate({_id: bookId}, {subscribers: book.subscribers}, {upsert: true}, function(err, docs) {
      //     if(err) {
      //       res.status(500).json({message : "failed to unsubscribe"})
      //     }
      //   })
      // })

  } catch(e) {
    res.status(500).json({ message : "Error"})
  }
})

module.exports = router