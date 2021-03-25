const SB = require('./SubscribedBook');

module.exports = class SubBookAdapter {
  constructor() { }

  find(options) {
    return SB.find(options);
  }

  findOneAndUpdate(options, data) {
    return SB.findOneAndUpdate(options, data, { upset: true }, () => {

    });
  }
};
