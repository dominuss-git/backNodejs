const {Router} = require('express')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const UserAdress = require('../models/UserAdress')
const jwt = require('jsonwebtoken')
const config = require('config')
const logget = require('../config/logger')

const router = Router()

router.post(
  '/register',
  [
    check('email', 'invalid Email').isEmail(),
    check('password', 'min passwaord length is 6 chars').isLength({min: 6}),
  ],
   async (req, res) => {
  try {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
      logger.error(`FROM ${req.original} POST ${req.body.email} -- invalid regitration data STATUS 400`)
      return res.status(400).json({
        message: 'invalid registretion data'
      })
    }

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
      confirm_password
    } = req.body

    const candinate = await User.findOne({ email })

    if (candinate) {
      logger.error(`FROM ${req.original} POST ${email} -- user was already exist STATUS 400`)
      return res.status(400).json({ message : 'user was already exist'})
    }
    if (password !== confirm_password) {
      logger.error(`FROM ${req.original} POST ${email} -- passwords mismatch STATUS 400`)
      return res.status(400).json({ message : 'passwords mismatch'})
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const adress = new UserAdress({
      country, 
      city, 
      street, 
      home : Number(home), 
      flat : Number(flat), 
      country_code, 
      operator_code: Number(operator_code), 
      number: Number(number),
    })

    await adress.save()

    const user = new User({
      name, 
      surname, 
      adress: adress._id, 
      email, 
      password : hashedPassword
    })

    await user.save()
    

    const token = jwt.sign(
      {
        userId: user.id,
      },
      config.get("jwtSecret"),
      {
        expiresIn: '1h'
      }
    )
    
    res.status(201).json({ token, userId: user.id })

  } catch(e) {
    logger.error(`FROM ${req.original} POST ${req.body.email} -- ${e} STATUS 500`)
    res.status(500).json({ message : 'Error' })
  }
})

router.post(
  '/login',
  [
    check('email', 'Enter valid email').normalizeEmail().isEmail(),
    check('password', 'Enter password').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if(!errors.isEmpty()) {
        logger.error(`FROM ${req.original} POST ${req.body.email} -- invalid login data STATUS 400`)
        return res.status(400).json({
          message: 'invalid login data'
        })
      }

      const {email, password} = req.body

      const user = await User.findOne({ email })

      if(!user) {
        logger.error(`FROM ${req.original} POST ${email} -- user not exist STATUS 400`)
        return res.status(400).json({ message: 'user not exist'})
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        logger.error(`FROM ${req.original} POST ${email} -- passwords missmatch STATUS 400`)
        return res.status(400).json({ message: "wrong password, try again"})
      }

      const token = jwt.sign(
        {
          userId: user.id,
        },
        config.get("jwtSecret"),
        {
          expiresIn: '1h'
        }
      )

      res.json({ token, userId: user.id })

    } catch(e) {
      logger.error(`FROM ${req.original} POST ${req.body.email} -- ${e} STATUS 500`)
      res.status(500).json({ message : 'Error' })
    }
})

module.exports = router