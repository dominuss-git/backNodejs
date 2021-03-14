const {Schema, model} = require('mongoose')

const schema = new Schema({
  name : {
    type: String,
    required: true,
  },
  genre : {
    type: String,
    required: true,
  },
  authors : [{
    type: String,
    required: true,
  }],
  subscribers: [{
    type: String
  }],
  data: {
    type: String,
    required: true
  }
})

module.exports = model('Book', schema)