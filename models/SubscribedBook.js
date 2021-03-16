const {Schema, model, ObjectId} = require('mongoose')

const schema = new Schema({
  userId: {
    type: ObjectId,
    required: true
  },
  bookId : {
    type: ObjectId,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = model('SubscribedBook', schema)