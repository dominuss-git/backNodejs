const {Router} = require('express')
const User = require('../models/User')

const router = Router()

router.post('/get', async (req, res) => {
  try {
    const userId = req.body
    const data = await User.findById(userId.userId)

    res.status(201).json({name: data.name, surname: data.surname, adress: data.adress, books: data.books, email: data.email})
    

  } catch(e) {
    res.status(500).json({ message : "error"})
  }
})

module.exports = router