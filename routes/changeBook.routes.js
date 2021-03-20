// const express = require('express')
const {Router} = require('express')
const Book = require('../models/Book')
const User = require('../models/User')
const SubscribedBook = require('../models/SubscribedBook')
// const mongoose = require('mongoose')
// const moment = require('moment')
const logger = require('../config/logger')

const router = Router()

router.post('/create', async (req, res) => {
  try {
    let {name, genre, authors, data, count}  = req.body

    // name = name.split(' ').join(' ')

    if (name === '' || name[0] == ' ') {
      logger.error(`FROM ${req.original} POST ${name} -- name is required STATUS 400`)
      return res.status(400).json({message: "You must be enter book name"})
    } else if (genre === '' || genre[0] === ' ') {
      logger.error(`FROM ${req.original} POST ${genre} -- genre is required STATUS 400`)
      return res.status(400).json({message: "You must be enter genre"})
    } else if (data === '' || data[0] === ' ') {
      logger.error(`FROM ${req.original} POST ${data} -- data is required STATUS 400`)
      return res.status(400).json({message: "You must be enter release data"})
    } else if (authors === '' || authors[0] === ' ') {
      logger.error(`FROM ${req.original} POST ${authors} -- authors is required STATUS 400`)
      return res.status(400).json({message: "You must be enter author/authors"})
    } else if (count === '' || count[0] === '') {
      logger.error(`FROM ${req.original} POST ${count} -- count is required STATUS 400`)
      return res.status(400).json({message: "You must be enter books count"})
    }

    const author = authors.split(',')  

    let date = new Date(data)
    // date = date.toLocaleString('en-US', options)

    if (!date.getMonth() || !date.getDate() || !date.getFullYear()) {
      logger.error(`FROM ${req.original} POST ${date} -- invalid date STATUS 400`)
      return res.status(400).json({ message: 'Date must be in format MM.DD.YYYY'})
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
    logger.error(`FROM ${req.original} POST book -- ${e} is required STATUS 500`)
    res.status(500).json({ message : "Error"})
  }
})

router.put('/subscribe', async (req, res) => {
  try {
    const {isSubscribe, bookId, userId}  = req.body

    if (!userId) {
      logger.error(`FROM ${req.original} PUT ${userId} -- user id is required STATUS 400`)
      return res.status(400).json({ message : "you must be authorization"})
    }

    if (!bookId) {
      logger.error(`FROM ${req.original} PUT ${userId} -- subscribed book id is required STATUS 400`)
      return res.status(400).json({ message : "you must be authorization"})
    }

    const user = await User.findById(userId)
    const book = await Book.findById(bookId)

    if (user === null) {
      logger.error(`FROM ${req.original} PUT ${userId} -- user not found STATUS 400`)
      return res.status(400).json({ message : "you must be authorization"})
    }

    if (book === null) {
      logger.error(`FROM ${req.original} PUT ${bookId} -- book is deleted STATUS 404`)
      // return res.status(400).json({ message : "you must be authorization"})
      return res.status(404).json({message: "book is deleted", isActive: false})
    }

    if (book.count === book.subscribers.length) {
      logger.error(`FROM ${req.original} PUT ${bookId} -- not available STATUS 204`)
      // return res.status(400).json({ message : "you must be authorization"})
      return res.status(204).json({message: "not available", isActive: false})
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
          logger.error(`FROM ${req.original} PUT ${userId} -- ${err} STATUS 500`)
          return res.status(500).json({message : "failed to subscribe", isActive: false})
      }

        Book.findOneAndUpdate({_id: bookId}, {subscribers: book.subscribers}, {upsert: true}, function(err, docs) {
          if(err) {
            logger.error(`FROM ${req.original} PUT ${bookId} -- ${err} STATUS 500`)
            return res.status(500).json({message : "failed to subscribe", isActive: false})
          }
        })
      })
    } else {
      logger.error(`FROM ${req.original} PUT ${userId} -- already subscribed STATUS 400`)
      return res.status(400).json({message : "you already subsribe", isActive: false})
    }

    res.status(201).json({message: "subscribed", isActive: true})
  } catch(e) {
    logger.error(`FROM ${req.original} PUT ${req.body.userId} -- ${e} STATUS 500`)
    res.status(500).json({ message : "Error"})
  }
})

router.put('/unsubscribe', async (req, res) => {
  try {
    const {isSubscribe, bookId, userId}  = req.body

    if (!bookId) {
      logger.error(`FROM ${req.original} PUT ${bookId} -- subscribed book id is required STATUS 400`)
      return res.status(400).json({ message : "You must be authorization required"})
    }

    if (!userId) {
      logger.error(`FROM ${req.original} PUT ${userId} -- user id id is required STATUS 400`)
      return res.status(400).json({ message : "you must be authorization"})
    }

    if (isSubscribe) {

      let subscribedBook = await SubscribedBook.findById(bookId)
      
      if (subscribedBook === null) {
        subscribedBook = await SubscribedBook.findOne({
          bookId: bookId,
          userId: userId
        }, function(err, docs) {
          if (err) {
            logger.error(`FROM ${req.original} PUT ${userId} -- ${err} STATUS 500`)
            return res.status(500).json({ message : "failed unsubscribe"})
          }
        })
      } else {
        logger.error(`FROM ${req.original} PUT ${userId} -- ${err} STATUS 500`)
        return res.status(500).json({ message : "subscribed book not founde"})
      }
  
      const user = await User.findOne({books: subscribedBook.id})
      const book = await Book.findOne({subscribers: subscribedBook.id})
  
      if (book === null) {
        logger.error(`FROM ${req.original} PUT ${book} -- book not found STATUS 400`)
        return res.status(400).json({message: "book is deleted"})
      }

      if (user === null) {
        logger.error(`FROM ${req.original} PUT ${user} -- user not found STATUS 400`)
        return res.status(400).json({message: "You must be authorization"})
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
          logger.error(`FROM ${req.original} PUT ${userId} -- ${err} STATUS 500`)
          return res.status(500).json({message : "failed to unsubscribe"})
        }

        Book.findOneAndUpdate({_id: book.id}, {subscribers: book.subscribers}, {upsert: true}, function(err, docs) {
          if(err) {
            logger.error(`FROM ${req.original} PUT ${book.id} -- ${err} STATUS 500`)
            return res.status(500).json({message : "failed to unsubscribe"})
          }
        })
      })

    } else {
      logger.error(`FROM ${req.original} PUT ${userId} -- not subscribe STATUS 400`)
      return res.status(400).json({message : "you are not subscribe"})
    }

    res.status(201).json({message: "unsubscribed"})
  } catch(e) {
    logger.error(`FROM ${req.original} PUT ${req.body.userId} -- ${e} STATUS 500`)
    res.status(500).json({ message : "Error"})
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const bookId  = req.params.id

    if (!bookId) {
      logger.error(`FROM ${req.original} DELETE ${bookId} -- book id is required STATUS 400`)
      return res.status(400).json({ message : "you must be authorization"})
    }

    const book = await Book.findById(bookId)

    if (book === null) {
      logger.error(`FROM ${req.original} DELETE ${bookId} -- book not found STATUS 400`)
      return res.status(400).json({ message : "book not found"})
    }

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
          logger.error(`FROM ${req.original} DELETE ${bookId} -- failed to delete STATUS 404`)
          res.status(404).json({message : "failed to delete"})
        }
      })

      await subscriber.remove()
    })

    await book.remove()

    return res.status(200).json({message: "book delete"})

  } catch(e) {
    logger.error(`FROM ${req.original} DELETE ${req.body.bookId} -- ${e} STATUS 500`)
    res.status(500).json({ message : "Error"})
  }
})

module.exports = router