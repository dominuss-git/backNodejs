const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  name : {
    type: String,
    required: true,
  },
  surname : {
    type: String,
    required: true
  },
  adress : {
    type: String,
    required: true
  },
  email : {
    type: String,
    required: true,
    unique: true 
  },
  password: {
    type: String,
    required: true
  },
  books: [{
    type: String
  }]
})

module.exports = model('User', schema)