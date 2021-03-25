const { Router } = require('express');
const logger = require('../config/logger');
const Book = require('../database/book/Book');
const SubscribedBook = require('../database/subscribedBook/SubscribedBook');
const UserAdapter = require('../database/user/adapter');
const BookAdapter = require('../database/book/adapter');
const SubBookAdapter = require('../database/subscribedBook/adapter');

const router = Router();

router.post('/create', async (req, res) => {
  try {
    const {
      name, genre, authors, data, count,
    } = req.body;

    if (name === '' || name[0] === ' ') {
      logger.error(`FROM ${req.original} POST ${name} -- name is required STATUS 400`);
      return res.status(400).json({ message: 'You must be enter book name' });
    } if (genre === '' || genre[0] === ' ') {
      logger.error(`FROM ${req.original} POST ${genre} -- genre is required STATUS 400`);
      return res.status(400).json({ message: 'You must be enter genre' });
    } if (data === '' || data[0] === ' ') {
      logger.error(`FROM ${req.original} POST ${data} -- data is required STATUS 400`);
      return res.status(400).json({ message: 'You must be enter release data' });
    } if (authors === '' || authors[0] === ' ') {
      logger.error(`FROM ${req.original} POST ${authors} -- authors is required STATUS 400`);
      return res.status(400).json({ message: 'You must be enter author/authors' });
    } if (count === '' || count[0] === '') {
      logger.error(`FROM ${req.original} POST ${count} -- count is required STATUS 400`);
      return res.status(400).json({ message: 'You must be enter books count' });
    }

    const author = authors.split(',');
    const date = new Date(data);

    if (!date.getMonth() || !date.getDate() || !date.getFullYear()) {
      logger.error(`FROM ${req.original} POST ${date} -- invalid date STATUS 400`);
      return res.status(400).json({ message: 'Date must be in format MM.DD.YYYY' });
    }

    const book = new Book({
      name,
      genre,
      authors: author,
      data: date,
      count: Number(count),
    });

    await book.save();

    return res.status(201).json({ message: 'Book add' });
  } catch (e) {
    logger.error(`FROM ${req.original} POST book -- ${e} is required STATUS 500`);
    return res.status(500).json({ message: 'Error' });
  }
});

router.put('/subscribe', async (req, res) => {
  try {
    const { isSubscribe, bookId, userId } = req.body;
    const usr = new UserAdapter();
    const bookAdapter = new BookAdapter();

    if (!userId) {
      logger.error(`FROM ${req.original} PUT ${userId} -- user id is required STATUS 400`);
      return res.status(400).json({ message: 'you must be authorization' });
    }

    if (!bookId) {
      logger.error(`FROM ${req.original} PUT ${userId} -- subscribed book id is required STATUS 400`);
      return res.status(400).json({ message: 'you must be authorization' });
    }

    const user = (await usr.find({ _id: userId }))[0];
    const book = (await bookAdapter.find({ _id: bookId }))[0];

    if (user === null) {
      logger.error(`FROM ${req.original} PUT ${userId} -- user not found STATUS 404`);
      return res.status(404).json({ message: 'you must be authorization' });
    }

    if (book === null) {
      logger.error(`FROM ${req.original} PUT ${bookId} -- book is deleted STATUS 404`);
      return res.status(404).json({ message: 'book is deleted', isActive: false });
    }

    if (book.count === book.subscribers.length) {
      logger.error(`FROM ${req.original} PUT ${bookId} -- not available STATUS 204`);
      return res.status(204).json({ message: 'not available', isActive: false });
    }

    if (!isSubscribe) {
      const subscribedBook = await SubscribedBook({
        bookId,
        userId,
      });

      user.books[user.books.length] = subscribedBook.id;
      book.subscribers[book.subscribers.length] = subscribedBook.id;

      usr.findOneAndUpdate({ _id: userId }, { books: user.books })
        .then(bookAdapter.findOneAndUpdate({ _id: bookId }, { subscribers: book.subscribers }))
        .then(() => res.status(201).json({ message: 'subscribed', isActive: true })).catch(() => {
          logger.error(`FROM ${req.original} PUT ${userId} -- subscribe server error STATUS 500`);
          return res.status(500).json({ message: 'Server Error failed subscribe' });
        })
        .then(() => subscribedBook.save())
        .then(() => res.status(200).json({ message: 'subscribed' }))
        .catch((e) => {
          logger.error(`FROM ${req.original} PUT ${req.body.userId} -- ${e} STATUS 500`);
          return res.status(500).json({ message: 'Error' });
        });
    } else {
      logger.error(`FROM ${req.original} PUT ${userId} -- already subscribed STATUS 400`);
      return res.status(400).json({ message: 'you already subsribe', isActive: false });
    }
  } catch (e) {
    logger.error(`FROM ${req.original} PUT ${req.body.userId} -- ${e} STATUS 500`);
    return res.status(500).json({ message: 'Error' });
  }
});

router.put('/unsubscribe', async (req, res) => {
  try {
    const { isSubscribe, bookId, userId } = req.body;
    const usr = new UserAdapter();
    const bookAdapter = new BookAdapter();
    const subBook = new SubBookAdapter();

    if (!bookId) {
      logger.error(`FROM ${req.original} PUT ${bookId} -- subscribed book id is required STATUS 400`);
      return res.status(400).json({ message: 'You must be authorization required' });
    }

    if (!userId) {
      logger.error(`FROM ${req.original} PUT ${userId} -- user id id is required STATUS 400`);
      return res.status(400).json({ message: 'you must be authorization' });
    }

    if (isSubscribe) {
      let subscribedBook = await SubscribedBook.findById(bookId);

      if (subscribedBook === null) {
        subscribedBook = (await subBook.find({
          bookId,
          userId,
        }))[0];
      } else if (!subscribedBook) {
        logger.error(`FROM ${req.original} PUT ${userId} -- subscribed book bot found STATUS 500`);
        return res.status(500).json({ message: 'subscribed book not found' });
      }

      const user = (await usr.find({ books: subscribedBook.id }))[0];
      const book = (await bookAdapter.find({ subscribers: subscribedBook.id }))[0];

      if (book === null) {
        logger.error(`FROM ${req.original} PUT ${book} -- book not found STATUS 404`);
        return res.status(404).json({ message: 'book is deleted' });
      }

      if (user === null) {
        logger.error(`FROM ${req.original} PUT ${user} -- user not found STATUS 404`);
        return res.status(404).json({ message: 'You must be authorization' });
      }

      for (const i in user.books) {
        if (user.books[i].equals(subscribedBook.id)) {
          user.books.splice(i, 1);
          break;
        }
      }

      for (const i in book.subscribers) {
        if (book.subscribers[i].equals(subscribedBook.id)) {
          book.subscribers.splice(i, 1);
          break;
        }
      }

      usr.findOneAndUpdate({ _id: userId }, { books: user.books })
        .then(bookAdapter.findOneAndUpdate({ _id: book.id }, { subscribers: book.subscribers }))
        .then(() => (
          subscribedBook.remove()
        )).then(() => res.status(201).json({ message: 'unsubscribed' }))
        .catch(() => {
          logger.error(`FROM ${req.original} PUT ${userId} -- unsubscribe server error STATUS 500`);
          return res.status(500).json({ message: 'Server error' });
        });
    } else {
      logger.error(`FROM ${req.original} PUT ${userId} -- not subscribe STATUS 400`);
      return res.status(400).json({ message: 'you are not subscribe' });
    }
  } catch (e) {
    logger.error(`FROM ${req.original} PUT ${req.body.userId} -- ${e} STATUS 500`);
    return res.status(500).json({ message: 'Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    const usr = new UserAdapter();
    const bookAdapter = new BookAdapter();
    const subBook = new SubBookAdapter();

    if (!bookId) {
      logger.error(`FROM ${req.original} DELETE ${bookId} -- book id is required STATUS 400`);
      return res.status(400).json({ message: 'you must be authorization' });
    }

    const book = (await bookAdapter.find({ _id: bookId }))[0];

    if (book === null) {
      logger.error(`FROM ${req.original} DELETE ${bookId} -- book not found STATUS 404`);
      return res.status(404).json({ message: 'book not found' });
    }

    book.subscribers.map(async (val, i) => {
      const subscriber = (await subBook.find({ _id: val }))[0];
      const user = (await usr.find({ _id: subscriber.userId }))[0];

      for (const j in user.books) {
        if (String(user.books[j]) === String(val)) {
          user.books.splice(i, 1);
          break;
        }
      }

      usr.findOneAndUpdate({ _id: user._id }, { books: user.books })
        .then(() => {
          logger.error(`FROM ${req.original} DELETE ${bookId} -- failed delete STATUS 500`);
          return subscriber.remove();
        })
        .catch(() => {
          res.status(500).json({ message: 'Server Error' });
        });
    });

    await book.remove();

    return res.status(200).json({ message: 'book delete' });
  } catch (e) {
    logger.error(`FROM ${req.original} DELETE ${req.body.bookId} -- ${e} STATUS 500`);
    return res.status(500).json({ message: 'Error' });
  }
});

module.exports = router;
