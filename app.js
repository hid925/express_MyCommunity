var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var savename;
var multer = require('multer');
var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/free/images')
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);

  //cb(null, Date.now()+ '_' + file.originalname )
  savename = datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]
  }
})
var upload = multer({ storage: _storage})

var index = require('./routes/index');
//var users = require('./routes/users');
var topic = require('./routes/topic')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
//app.use('/free_view', topic);
//app.use('/users', users);
app.use('/public/uploads/free/images',express.static('public/uploads/free/images'))

var Client = require('mariasql');

var c = new Client({
  host: 'localhost',
  user: 'root',
  password: '1234',
  db: 'test',
  charset: 'utf8'
});



app.get('/free_view/:fNum/delete',function(req,res){
  var fNum = req.params.fNum;
  var sql = 'DELETE FROM f_board WHERE fNum = ?';
  c.query(sql, [fNum] , function(err, result, fields){
    if(err)
      console.log(err);
    //console.log(result);
    res.redirect('/free_view');
  });
});

app.post('/free_view/:fNum/edit',function(req,res){
  var sql = 'UPDATE f_board SET fTitle=?, fCategory=?, fContent=? WHERE fNum=?';
  var fNum = req.params.fNum;
  var title = req.body.fTitle;
  var category = req.body.fCategory;
  var content = req.body.fContent;

  c.query(sql,[
    title,
    category,
    content,
    fNum
  ], function(err, results, fields){
    if(err){
      console.log(err);
    }else{
      //res.send(results);
      res.redirect('/free_view/'+fNum)
    }
  });
});
app.get('/free_view/:fNum/edit',function(req,res){
  var fNum = req.params.fNum
  if(!fNum){
    throw err;
  }else{
    var sql = 'SELECT * FROM f_board WHERE fNum = ?';
    c.query(sql, [fNum], function(err, rows){
      if(err)
        console.log(err);
    //  res.send(rows);
    //  console.log(rows);
    res.render('topic/free_edit',{rows:rows});
    });
  };
  //res.send('edit');
});

app.post('/free_view/add',upload.single('upload'), function(req,res){
  var title = req.body.fTitle;
  var category = req.body.fCategory;
  var content = req.body.fContent;
  var did = req.body.fDid;     //나중에 로그인 하고 수정
  var id = req.body.fId;           //나중에 로그인 하고 수정
  var filename = savename;

  var sql = 'INSERT INTO f_board (fTitle, fCategory, fContent, fDid, fId, file) VALUES(?,?,?,?,?,?)';
  c.query(sql, [title, category, content, did, id, savename], function(err, result, fields){
    if(err){
      console.log(err);
    }else{
      res.redirect('/free_view/'+result.info.insertId);
    }
  })
});
app.get('/free_view/add', function(req,res){
  res.render('topic/free_add');
});

app.get('/free_view/:fNum', function(req,res){
  var fNum = req.params.fNum;
  var sql = 'SELECT * FROM f_board WHERE fNum = ?';
  c.query(sql, [fNum], function(err, rows){
    if(err){
      console.log(err);
    }else{
      //res.send(rows)
      var sql= 'UPDATE f_board SET fHit = fHit+1 WHERE fNum = ?'
      c.query(sql,[fNum],function(err){
        if(err)
          console.log(err);
      });
      res.render('topic/free_detail', {rows,rows});
    }
  })
});
app.get('/free_view', function(req,res){
  var sql = 'Select * From f_board order by fNum desc'
  c.query(sql, function(err, rows) {
    if (err)
      throw err;
    res.render('topic/free_view',{rows:rows});
  });
});


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
