const Book = require('./Book');

module.exports = class BookAdapter {
  constructor() { }

  find(options) {
    return Book.find(options);
  }

  findOneAndUpdate(options, data) {
    return Book.findOneAndUpdate(options, data, { upset: true }, () => {

    });
  }
};
