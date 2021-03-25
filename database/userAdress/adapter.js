const UA = require('./UserAdress');

module.exports = class UsrAddrAdapter {
  constructor() { }

  find(options) {
    return UA.find(options);
  }

  findOneAndUpdate(options, data) {
    return UA.findOneAndUpdate(options, data, { upset: true }, () => {

    });
  }

  findOneAndRemove(options) {
    return UA.findOneAndRemove(options, () => {

    });
  }
};
