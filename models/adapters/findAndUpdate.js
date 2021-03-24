const User = require('../User');
const Book = require('../Book');
const SubscribedBook = require('../SubscribedBook');
const UserAdress = require('../UserAdress');

module.exports = function findOneAndUpdate(model, options, data) {
  // this.fetch = function (model, options) {
  console.log(options);

  if (model === 'User') {
    return User.findOneAndUpdate(options, data, { upset: true }, (err, docs) => {

    });
  } if (model === 'Book') {
    return Book.findOneAndUpdate(options, data, { upset: true }, (err, docs) => {});
  } if (model === 'SB') {
    return SubscribedBook.findOneAndUpdate(options, data, { upset: true }, (err, docs) => {
    });
  } if (model === 'UA') {
    return UserAdress.findOneAndUpdate(options, data, { upset: true }, (err, docs) => {

    });
  }
  // }
};
