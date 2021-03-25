const {
  Schema, model,
} = require('mongoose');

const schema = new Schema({
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  home: {
    type: Number,
    required: true,
  },
  flat: {
    type: Number,
    required: true,
  },
  country_code: {
    type: String,
    required: true,
  },
  operator_code: {
    type: Number,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
});

module.exports = model('UserAdress', schema);
