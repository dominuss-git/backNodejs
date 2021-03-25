const User = require('./User');

module.exports = class UserAdapter {
  constructor() { }

  find(options) {
    return User.find(options);
  }

  findOneAndUpdate(options, data) {
    return User.findOneAndUpdate(options, data, { upset: true }, () => {

    });
  }

  findOneAndRemove(options) {
    return User.findOneAndRemove(options, () => {

    });
  }
};
