var app = require('./config/express')();
var passport = require('./config/passport')(app);

var index = require('./routes/index');
app.use('/', index);

var users = require('./routes/users')(passport);
app.use('/users', users);

var topic = require('./routes/topics/topic');
app.use('/free_view', topic);

// catch 404 and forward to error handler
app.use(function(req, res, next){
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, function() {     //3000포트로 연결
  console.log('Conneted, 3000 port!');
});


module.exports = app;
