const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit || 8;
    this.transmittedDataAmount = 0;
    this.encoding = options.encoding;
  }

  _transform(chunk, encoding, callback) {
    this.transmittedDataAmount += chunk.toString(this.encoding).length;

    if (this.transmittedDataAmount > this.limit) {
      callback(new LimitExceededError('Was reached data limit'));
      return;
    }
    callback(null, chunk, encoding);
  }
}

module.exports = LimitSizeStream;
