module.exports = function(){

  var express = require('express');
  var path = require('path');
  var favicon = require('serve-favicon');
  var logger = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');

  var session = require('express-session');
  var Client = require('mariasql');
  var SessionStore = require('express-sql-session')(session);
  var options ={
    client: 'mysql',
    connection: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '1234',
      database: 'test'
  },
  table: 'sessions',
  expires: 365 * 24 * 60 * 60 * 1000 // 1 year in ms
  }
  var sessionStore = new SessionStore(options)

  var app = express();
  // view engine setup
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'jade');

  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../public')));

  app.use(session({
    secret: '$#FIWRKEMCLQWER3QW35382JFCM%$',
    resave: true,
    saveUninitialized: true,
    store: sessionStore
  }))

  app.use('/public/uploads/free/images',express.static('public/uploads/free/images'))


  return app;
}
