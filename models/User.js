const {Schema, model, ObjectId} = require('mongoose')

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
    type: ObjectId,
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
    type: ObjectId
  }]
})

module.exports = model('User', schema)