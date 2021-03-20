const {Router} = require('express')
const Book = require('../models/Book')
const SubscribedBook = require('../models/SubscribedBook')
const User = require('../models/User')
const logger = require('../config/logger')

const router = Router()

router.post('/search', async (req, res) => {
  try {
    const {book, genre, authors, userId} = req.body

    if (userId == "") {
      logger.error(`FROM ${req.original} POST ${userId} -- user id is required STATUS 400`)
      return res.status(400).json({ message : "you must be authorization"})
    }

    const user = await User.findById(userId, function (err, docs) {
      if (err) {
        logger.error(`FROM ${req.original} POST ${userId} -- user not found STATUS 400`)
        return res.status(400).json({ message : "you must be authorization"})
      }
    })

    if (user == null) {
      logger.error(`FROM ${req.original} POST ${userId} -- user id is required STATUS 400`)
      return res.status(400).json({ message : "you must be authorization"})
    }

    querySelection = {
      ...(book && {name: {"$regex" : book, "$options" : "i"}}),
      ...(genre && {genre: {"$regex": genre, "$options" : "i"}}),
      ...(authors && {authors: {"$regex": authors, "$options": "i"}})
    }

    const books = await Book.find(querySelection)

    res.status(200).json({ books, user_books: user.books})

  } catch(e) {
    logger.error(`FROM ${req.original} POST ${userId} -- ${e} STATUS 500`)
    // return res.status(400).json({ message : "you must be authorization"})
    res.status(500).json({ message : e})
  }
})

router.get('/:id', async (req, res) => {
  try {
    const bookId = req.params.id

    if (bookId == "") {
      logger.error(`FROM ${req.original} GET ${bookId} -- book id is required STATUS 404`)
      return res.status(404).json({ message : "book id is required"})
    }

    const subscribed_book = await SubscribedBook.findById(bookId)

    if (subscribed_book == null) {
      logger.error(`FROM ${req.original} GET ${bookId} -- subscribed book not found STATUS 404`)
      return res.status(404).json({ message : "book not found"})
    }

    const book = await Book.findById(subscribed_book.bookId)

    if (book == null) {
      logger.error(`FROM ${req.original} GET ${bookId} -- book not found STATUS 404`)
      return res.status(404).json({ message : "book not found"})
    }

    res.status(200).json({name : book.name, genre: book.genre, authors: book.authors})
  } catch(e) {
    logger.error(`FROM ${req.original} GET ${req.params.id} -- ${e} STATUS 500`)
    return res.status(500).json({ message : e})
  }
})

module.exports = router