module.exports = function() {

  var express = require('express');
  var app = express();

  var Client = require('mariasql');

  var db = new Client({
    host: 'localhost',
    user: 'root',
    password: '1234'
  });



  return route;

}
