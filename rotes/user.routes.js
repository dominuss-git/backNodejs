const {Router} = require('express')
const User = require('../models/User')
const UserAdress = require('../models/UserAdress')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')

const router = Router()

router.post('/get', async (req, res) => {
  try {
    const userId = req.body
    const data = await User.findById(userId.userId)

    const userAdress = await UserAdress.findById(data.adress)

    res.status(201).json({
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
    res.status(500).json({ message : "error"})
  }
})

router.post('/change',
[
  check('email', 'invalid Email').isEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
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

    if (candinate) {
      return res.status(400).json({ message : 'user was already exist'})
    }

    const user = await User.findById(userId)

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "wrong password"})
    }

    await User.findOneAndUpdate({_id: userId}, {
      name: name,
      surname: surname,
      email: email
      }, 
      {upset:true}, 
      function(err, docs) {
        if(err) {
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
          return res.status(400).json({ message: "wrong input data"})
        }
      })

    res.status(201).json({ message: "data inserted", status: true})

  } catch(e) {
    res.status(500).json({ message : "error"})
  }

})

module.exports = router