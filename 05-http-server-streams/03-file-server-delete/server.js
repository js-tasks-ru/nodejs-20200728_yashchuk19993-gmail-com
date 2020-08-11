const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (new RegExp('\/|/').test(pathname)) {
        res.statusCode = 400;
        res.end('Can`t contain slash symbol on the name');
      } else {
        fs.unlink(filepath, (error) =>{
          if (error) {
            if (error.code === 'ENOENT') {
              res.statusCode = 404;
              res.end('File not found');
            } else {
              res.statusCode = 500;
              res.end('Internal server error');
            }
          } else {
            res.statusCode = 200;
            res.end('File was deleted');
          }
        });
      }
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
