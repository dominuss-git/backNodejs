const User = require('../User');
const Book = require('../Book');
const SubscribedBook = require('../SubscribedBook');
const UserAdress = require('../UserAdress');

module.exports = function GetAdapter(model, options) {
  // this.fetch = function (model, options) {
  console.log(options);

  if (model === 'User') {
    return User.find(options);
  } if (model === 'Book') {
    return Book.find(options);
  } if (model === 'SB') {
    return SubscribedBook.find(options);
  } if (model === 'UA') {
    return UserAdress.find(options);
  }
  // }
};
