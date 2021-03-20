const {Router} = require('express')
const User = require('../models/User')
const UserAdress = require('../models/UserAdress')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const logger = require('../config/logger')

const router = Router()

router.get('/:id', async (req, res) => {
  try {
    
    const userId = req.params.id

    if (!userId) {
      logger.error(`FROM ${req.original} GET ${userId} -- user id is required STATUS 400`)
      return res.status(400).json({ message : "user id is required"})  // 400
    }

    const data = await User.findById(userId)

    if (data == null) {
      logger.error(`FROM ${req.original} GET ${userId} -- user not found STATUS 404`)
      return res.status(404).json({ message : "user not found"}) 
    }

    const userAdress = await UserAdress.findById(data.adress)

    if (userAdress == null) {
      logger.error(`FROM ${req.original} GET ${data.adress} -- user adress not found STATUS 500`)
      return res.status(500).json({ message : "user adress not found"})
    }

    res.status(200).json({
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
      email: data.email
    })
    
  } catch(e) {
    logger.error(`FROM ${req.original} GET ${req.params.id} -- ${e} STATUS 500`)
    res.status(500).json({ message : e })
  }
})

router.put('/:id/change',
[
  check('email', 'invalid Email').isEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
      logger.error(`FROM ${req.original} PUT ${email} -- invalid email STATUS 400`)
      return res.status(400).json({
        message: 'invalid email'
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
      userId
    } = req.body
    
    const candinate = await User.findOne({ email })

    if (candinate && candinate.id !== userId) {
      logger.error(`FROM ${req.original} PUT ${email} -- user was already exist STATUS 400`)
      return res.status(400).json({ message : 'user was already exist'})
    }

    const user = await User.findById(userId)

    if (user == null) {
      logger.error(`FROM ${req.original} PUT ${userId} -- user not found STATUS 404`)
      return res.status(404).json({ message : "user not found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      logger.error(`FROM ${req.original} PUT password -- wrong password STATUS 400`)
      return res.status(400).json({ message: "wrong password"})
    }

    console.log("hi")

    await User.findOneAndUpdate({_id: userId}, {
      name: name,
      surname: surname,
      email: email
      }, 
      {upset:true}, 
      function(err, docs) {
        if(err) {
          logger.error(`FROM ${req.original} PUT ${userId} -- wrong input data STATUS 400`)
          return res.status(400).json({ message: "wrong input data"})
        }
      }
    )

    await UserAdress.findOneAndUpdate({_id: user.adress}, {
      country: country,
      city: city,
      street: street,
      home: Number(home),
      flat: Number(flat),
      country_code: country_code,
      operator_code: Number(operator_code),
      number: Number(number)
      },
      {upset: true},
      function(err, docs) {
        if(err) {
          logger.error(`FROM ${req.original} PUT ${user.adress} -- wrong input data STATUS 400`)
          return res.status(400).json({ message: "wrong input data"})
        }
      })

    res.status(200).json({ message: "data inserted", status: true})

  } catch(e) {
    logger.error(`FROM ${req.original} PUT ${req.params.id} -- ${e} STATUS 500`)
    res.status(500).json({ message : e})
  }

})

router.delete('/:id/delete', async (req, res) => {
  try {
    const userId = req.params.id

    if (!userId) {
      logger.error(`FROM ${req.original} DELETE ${userId} -- user id is required STATUS 404`)
      return res.status(404).json({ message : "you must be authorization"})
    }

    const user = await User.findById(userId)

    if (user.books.length !== 0) {
      logger.error(`FROM ${req.original} DELETE ${userId} -- user have books STATUS 400`)
      return res.status(400).json({ message : "you cannot delete your account until you turn in all the books"})
    } else {
      await user.remove()
      res.status(200).json({})
    }

  } catch (e) {
    logger.error(`FROM ${req.original} DELETE ${req.params.id} -- ${e} STATUS 500`)
    res.status(500).json({ message: "error" })
  }
}) 

module.exports = router