const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.encoding = options.encoding;
    this.temp = '';
  }

  getTemp(data) {
    if (this.temp.length) {
      data = this.temp + data;
      this.temp = '';
    }
    const index = data.indexOf(os.EOL);

    if (index === -1) return data;

    this.push(this.temp + data.slice(0, index));
    return this.getTemp(data.slice(index + 1));
  }

  _transform(chunk, encoding, callback) {
    const data = chunk.toString(this.encoding);
    this.temp = this.getTemp(data);
    callback();
  }

  _flush(callback) {
    if (this.temp.length) {
      this.push(this.temp);
    }
    callback();
  }
}

module.exports = LineSplitStream;
