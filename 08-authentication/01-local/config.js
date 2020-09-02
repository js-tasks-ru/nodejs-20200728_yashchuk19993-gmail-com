const {password, dbName} = require('../../config');


module.exports = {
  mongodb: {
    uri: (process.env.NODE_ENV === 'test') ?
      'mongodb://localhost/6-module-2-task' :
      `mongodb+srv://db_user:${password}@cluster0.lrf6s.mongodb.net/${dbName}?retryWrites=true&w=majority`,
  },
  crypto: {
    iterations: (process.env.NODE_ENV === 'test' ? 1 : 12000),
    length: 128,
    digest: 'sha512',
  },
};
