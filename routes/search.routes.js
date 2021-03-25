const { Router } = require('express');
const logger = require('../config/logger');
const BookAdapter = require('../database/book/adapter');
const SubBookAdapter = require('../database/subscribedBook/adapter');
const UserAdapter = require('../database/user/adapter');

const router = Router();

router.post('/search', async (req, res) => {
  const bookAdapter = new BookAdapter();
  const usr = new UserAdapter();

  try {
    const {
      book, genre, authors, userId,
    } = req.body;

    if (userId === '') {
      logger.error(`FROM ${req.original} POST ${userId} -- user id is required STATUS 400`);
      return res.status(400).json({ message: 'you must be authorization' });
    }
    const user = (await usr.find({ _id: userId }))[0];

    if (user == null) {
      logger.error(`FROM ${req.original} POST ${userId} -- user id is required STATUS 404`);
      return res.status(404).json({ message: 'you must be authorization' });
    }

    const querySelection = {
      ...(book && { name: { $regex: book, $options: 'i' } }),
      ...(genre && { genre: { $regex: genre, $options: 'i' } }),
      ...(authors && { authors: { $regex: authors, $options: 'i' } }),
    };

    const books = await bookAdapter.find(querySelection);

    return res.status(200).json({ books, user_books: user.books });
  } catch (e) {
    logger.error(`FROM ${req.original} POST user -- ${e} STATUS 500`);
    return res.status(500).json({ message: e });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const bookAdapter = new BookAdapter();
    const subBook = new SubBookAdapter();

    if (bookId === '') {
      logger.error(`FROM ${req.original} GET ${bookId} -- book id is required STATUS 404`);
      return res.status(404).json({ message: 'book id is required' });
    }
    const subscribedBook = (await subBook.find({ _id: bookId }))[0];

    if (subscribedBook === null) {
      logger.error(`FROM ${req.original} GET ${bookId} -- subscribed book not found STATUS 404`);
      return res.status(404).json({ message: 'book not found' });
    }

    const book = (await bookAdapter.find({ _id: subscribedBook.bookId }))[0];

    if (book == null) {
      logger.error(`FROM ${req.original} GET ${bookId} -- book not found STATUS 404`);
      return res.status(404).json({ message: '1book not found' });
    }

    return res.status(200).json({ name: book.name, genre: book.genre, authors: book.authors });
  } catch (e) {
    logger.error(`FROM ${req.original} GET ${req.params.id} -- ${e} STATUS 500`);
    return res.status(500).json({ message: e });
  }
});

module.exports = router;
