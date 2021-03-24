// const express = require('express')
const { Router } = require('express');
const Book = require('../models/Book');
const User = require('../models/User');
const SubscribedBook = require('../models/SubscribedBook');
const findOneAndUpdate = require('../models/adapters/findAndUpdate');
// const mongoose = require('mongoose')
// const moment = require('moment')
const logger = require('../config/logger');
const GetAdapter = require('../models/adapters/get');

const router = Router();

router.post('/create', async (req, res) => {
  try {
    const {
      name, genre, authors, data, count,
    } = req.body;

    // name = name.split(' ').join(' ')

    if (name === '' || name[0] == ' ') {
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
    // date = date.toLocaleString('en-US', options)

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

    res.status(201).json({ message: 'Book add' });
  } catch (e) {
    logger.error(`FROM ${req.original} POST book -- ${e} is required STATUS 500`);
    res.status(500).json({ message: 'Error' });
  }
});

router.put('/subscribe', async (req, res) => {
  try {
    const { isSubscribe, bookId, userId } = req.body;

    if (!userId) {
      logger.error(`FROM ${req.original} PUT ${userId} -- user id is required STATUS 400`);
      return res.status(400).json({ message: 'you must be authorization' });
    }

    if (!bookId) {
      logger.error(`FROM ${req.original} PUT ${userId} -- subscribed book id is required STATUS 400`);
      return res.status(400).json({ message: 'you must be authorization' });
    }

    // const user = await User.findById(userId)
    // const user = (await GetAdapter('User', { _id : userId}))[0]
    const user = (await GetAdapter('User', { _id: userId }))[0];
    // console.log(user)
    const book = (await GetAdapter('Book', { _id: bookId }))[0];
    // const book = await Book.findById(bookId)

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
      // return res.status(400).json({ message : "you must be authorization"})
      return res.status(204).json({ message: 'not available', isActive: false });
    }

    if (!isSubscribe) {
      const subscribedBook = await SubscribedBook({
        bookId,
        userId,
      });

      await subscribedBook.save();

      user.books[user.books.length] = subscribedBook.id;
      book.subscribers[book.subscribers.length] = subscribedBook.id;

      findOneAndUpdate('User', { _id: userId }, { books: user.books })
        .then(findOneAndUpdate('Book', { _id: bookId }, { subscribers: book.subscribers }))
        .then(() => res.status(201).json({ message: 'subscribed', isActive: true })).catch(() => {
          logger.error(`FROM ${req.original} PUT ${userId} -- subscribe server error STATUS 500`);
          res.status(500).json({ message: 'Server Error failed subscribe' });
        });
    } else {
      logger.error(`FROM ${req.original} PUT ${userId} -- already subscribed STATUS 400`);
      return res.status(400).json({ message: 'you already subsribe', isActive: false });
    }
  } catch (e) {
    logger.error(`FROM ${req.original} PUT ${req.body.userId} -- ${e} STATUS 500`);
    res.status(500).json({ message: 'Error' });
  }
});

router.put('/unsubscribe', async (req, res) => {
  try {
    const { isSubscribe, bookId, userId } = req.body;

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
        subscribedBook = (await GetAdapter('SB', {
          bookId,
          userId,
        }))[0];
      } else if (!subscribedBook) {
        logger.error(`FROM ${req.original} PUT ${userId} -- subscribed book bot found STATUS 500`);
        return res.status(500).json({ message: 'subscribed book not found' });
      }

      // console.log("hi")

      const user = (await GetAdapter('User', { books: subscribedBook.id }))[0];
      // const book = await Book.findOne({subscribers: subscribedBook.id})
      const book = (await GetAdapter('Book', { subscribers: subscribedBook.id }))[0];

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

      findOneAndUpdate('User', { _id: userId }, { books: user.books })
        .then(findOneAndUpdate('Book', { _id: book.id }, { subscribers: book.subscribers }))
        .then(() => (
          subscribedBook.remove()
        )).then(() => res.status(201).json({ message: 'unsubscribed' }))
        .catch(() => {
          logger.error(`FROM ${req.original} PUT ${userId} -- unsubscribe server error STATUS 500`);
          res.status(500).json({ message: 'Server error' });
        });
    } else {
      logger.error(`FROM ${req.original} PUT ${userId} -- not subscribe STATUS 400`);
      return res.status(400).json({ message: 'you are not subscribe' });
    }
  } catch (e) {
    logger.error(`FROM ${req.original} PUT ${req.body.userId} -- ${e} STATUS 500`);
    res.status(500).json({ message: 'Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const bookId = req.params.id;

    if (!bookId) {
      logger.error(`FROM ${req.original} DELETE ${bookId} -- book id is required STATUS 400`);
      return res.status(400).json({ message: 'you must be authorization' });
    }

    const book = (await GetAdapter('Book', { _id: bookId }))[0];// await Book.findById(bookId)

    if (book === null) {
      logger.error(`FROM ${req.original} DELETE ${bookId} -- book not found STATUS 404`);
      return res.status(404).json({ message: 'book not found' });
    }

    book.subscribers.map(async (val, i) => {
      const subscriber = (await GetAdapter('SB', { _id: val }))[0]; // await SubscribedBook.findById(val)
      const user = (await GetAdapter('User', { _id: subscriber.userId }))[0];// await User.findById(subscriber.userId)

      console.log(subscriber, user);

      for (const i in user.books) {
        if (String(user.books[i]) === String(val)) {
          user.books.splice(i, 1);
          break;
        }
      }

      console.log(user.books);

      // User.findOneAndUpdate({_id: user._id}, {books : user.books}, {upset:true}, function(err, docs) {
      //   if(err) {
      //     logger.error(`FROM ${req.original} DELETE ${bookId} -- failed to delete STATUS 404`)
      //     res.status(404).json({message : "failed to delete"})
      //   }
      // })

      findOneAndUpdate('User', { _id: user._id }, { books: user.books })
        .then(() => {
          logger.error(`FROM ${req.original} DELETE ${bookId} -- failed delete STATUS 500`);
          return subscriber.remove();
        })
        .catch(() => {
          res.status(500).json({ message: 'Server Error' });
        });

      // await subscriber.remove()
    });

    await book.remove();

    return res.status(200).json({ message: 'book delete' });
  } catch (e) {
    logger.error(`FROM ${req.original} DELETE ${req.body.bookId} -- ${e} STATUS 500`);
    res.status(500).json({ message: 'Error' });
  }
});

module.exports = router;
