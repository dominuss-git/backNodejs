const {Schema, model, ObjectId} = require('mongoose')

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
    type: ObjectId
  }],
  data: {
    type: Date,
    required: true
  },
  count: {
    type: Number,
    required: true
  }
})

module.exports = model('Book', schema)