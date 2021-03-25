const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../database/user/User');
const UserAdress = require('../database/userAdress/UserAdress');
const logger = require('../config/logger');
const UserAdapter = require('../database/user/adapter');
const UsrAddrAdapter = require('../database/userAdress/adapter');

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      logger.error(`FROM ${req.original} GET ${userId} -- user id is required STATUS 400`);
      return res.status(400).json({ message: 'user id is required' });
    }

    const data = await User.findById(userId);

    if (data == null) {
      logger.error(`FROM ${req.original} GET ${userId} -- user not found STATUS 404`);
      return res.status(404).json({ message: 'user not found' });
    }

    const userAdress = await UserAdress.findById(data.adress);

    if (userAdress == null) {
      logger.error(`FROM ${req.original} GET ${data.adress} -- user adress not found STATUS 500`);
      return res.status(500).json({ message: 'user adress not found' });
    }

    return res.status(200).json({
      name: data.name,
      surname: data.surname,
      country: userAdress.country,
      city: userAdress.city,
      street: userAdress.street,
      home: userAdress.home,
      flat: userAdress.flat,
      country_code: userAdress.country_code,
      operator_code: userAdress.operator_code,
      number: userAdress.number,
      books: data.books,
      email: data.email,
    });
  } catch (e) {
    logger.error(`FROM ${req.original} GET ${req.params.id} -- ${e} STATUS 500`);
    return res.status(500).json({ message: e });
  }
});

router.put('/:id/change',
  [
    check('email', 'invalid Email').isEmail(),
  ], async (req, res) => {
    try {
      const errors = validationResult(req);
      const usr = new UserAdapter();
      const ua = new UsrAddrAdapter();
      const {
        name,
        surname,
        country,
        city,
        street,
        home,
        flat,
        country_code,
        operator_code,
        number,
        email,
        password,
        userId,
      } = req.body;

      if (!errors.isEmpty()) {
        logger.error(`FROM ${req.original} PUT ${email} -- invalid email STATUS 400`);
        return res.status(400).json({
          message: 'invalid email',
        });
      }

      const candinate = (await usr.find({ email }))[0];

      if (candinate && candinate.id !== userId) {
        logger.error(`FROM ${req.original} PUT ${email} -- user was already exist STATUS 400`);
        return res.status(400).json({ message: 'user was already exist' });
      }

      const user = (await usr.find({ _id: userId }))[0];

      if (user == null) {
        logger.error(`FROM ${req.original} PUT ${userId} -- user not found STATUS 404`);
        return res.status(404).json({ message: 'user not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        logger.error(`FROM ${req.original} PUT password -- wrong password STATUS 400`);
        return res.status(400).json({ message: 'wrong password' });
      }
      usr.findOneAndUpdate({ _id: userId }, {
        name,
        surname,
        email,
      })
        .then(ua.findOneAndUpdate({ _id: user.adress }, {
          country,
          city,
          street,
          home: Number(home),
          flat: Number(flat),
          country_code,
          operator_code: Number(operator_code),
          number: Number(number),
        }))
        .then(() => res.status(200).json({ message: 'data inserted', status: true }))
        .catch(() => res.status(500).json({ message: 'Server error' }));
    } catch (e) {
      logger.error(`FROM ${req.original} PUT ${req.params.id} -- ${e} STATUS 500`);
      return res.status(500).json({ message: e });
    }
  });

router.delete('/:id/delete', async (req, res) => {
  try {
    const userId = req.params.id;
    const usr = new UserAdapter();
    const ua = new UsrAddrAdapter();

    if (!userId) {
      logger.error(`FROM ${req.original} DELETE ${userId} -- user id is required STATUS 404`);
      return res.status(404).json({ message: 'you must be authorization' });
    }

    const user = (await usr.find({ _id: userId }))[0];

    if (user.books.length !== 0) {
      logger.error(`FROM ${req.original} DELETE ${userId} -- user have books STATUS 400`);
      return res.status(400).json({ message: 'you cannot delete your account until you turn in all the books' });
    }

    ua.findOneAndRemove({ _id: user.adress })
      .then(() => user.remove())
      .then(() => res.status(200).json({}))
      .catch(() => res.status(500).json({ message: 'Server Error' }));
  } catch (e) {
    logger.error(`FROM ${req.original} DELETE ${req.params.id} -- ${e} STATUS 500`);
    return res.status(500).json({ message: 'error' });
  }
});

module.exports = router;
