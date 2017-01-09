module.exports = function(){

  var Client = require('mariasql');

  var db = new Client({
    host: 'localhost',
    user: 'root',
    password: '1234',
    db: 'test',
    charset: 'utf8'
  });

  return db;
}
