const {Router} = require('express')
const Book = require('../models/Book')

const router = Router()

router.post('/search', async (req, res) => {
  try {
    const {book, genre, authors} = req.body

    querySelection = {
      ...(book && {name: {"$regex" : book, "$options" : "i"}}),
      ...(genre && {genre: {"$regex": genre, "$options" : "i"}}),
      ...(authors && {authors: {"$regex": authors, "$options": "i"}})
    }

    const books = await Book.find(querySelection, (docs, err) => {

    })

    res.status(201).json({ books })

  } catch(e) {
    res.status(500).json({ message : "error"})
  }
})

router.post('/get', async (req, res) => {
  try {
    const bookId = req.body.bookId

    const book = await Book.findById(bookId)

    res.status(200).json({name : book.name, genre: book.genre, authors: book.authors})
  } catch(e) {
    res.status(500).json({ message : "error"})
  }
})

module.exports = router