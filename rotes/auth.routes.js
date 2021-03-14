const {Router} = require('express')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const config = require('config')

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
      return res.status(400).json({
        message: 'invalid registretion data'
      })
    }

    const {name, surname, adress, email, password, confirm_password} = req.body
    const candinate = await User.findOne({ email })

    if (candinate) {
      return res.status(400).json({ message : 'user was already exist'})
    }
    if (password !== confirm_password) {
      return res.status(400).json({ message : 'passwords mismatch'})
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({name, surname, adress, email, password : hashedPassword})

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
    
    res.json({ token, userId: user.id })

  } catch(e) {
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
        return res.status(400).json({
          message: 'invalid login data'
        })
      }

      const {email, password} = req.body

      const user = await User.findOne({ email })

      if(!user) {
        return res.status(400).json({ message: 'user not exist'})
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({ message: "wrong password, try again"})
      }

      console.log(user.id)

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
      res.status(500).json({ message : 'Error' })
    }
})

module.exports = router