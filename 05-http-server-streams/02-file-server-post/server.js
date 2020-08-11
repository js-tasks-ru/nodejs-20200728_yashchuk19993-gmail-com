const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const ONE_MEGA_BYTE = 1000000;
const compareCode = (code, targetCode) => code.localeCompare(targetCode) === 0;
const server = new http.Server();


server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (new RegExp('\/|/').test(pathname)) {
        res.statusCode = 400;
        res.end('Can`t contain slash symbol on the name');
      } else {
        const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
        const limitSizeStream = new LimitSizeStream({limit: ONE_MEGA_BYTE});

        req.on('close', function() {
          if (this.aborted) {
            fs.unlink(filepath, () =>{});
          }
        });


        writeStream.on('error', (error) => {
          if (compareCode(error.code, 'EEXIST')) {
            res.statusCode = 409;
            res.end('File exists');
          } else {
            res.statusCode = 500;
            res.end('Internal server error');
          }
        });

        limitSizeStream.on('error', (error) => {
          if (compareCode(error.code, 'LIMIT_EXCEEDED')) {
            res.statusCode = 413;
            res.end('File is more that limit');
          } else {
            res.statusCode = 500;
            res.end('Internal server error');
          }
          fs.unlink(filepath, () =>{});
        });

        writeStream.on('finish', () => {
          res.statusCode = 201;
          res.end('File was received');
        });

        req.pipe(limitSizeStream).pipe(writeStream);
      }
      break;
    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
