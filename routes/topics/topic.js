var router = require('express').Router();
var db = require('../../config/db')();

var savename;
var multer = require('multer');
var _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/free/images')
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    cb(null, datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    savename = datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]
  }
})
var upload = multer({ storage: _storage})


router.get('/:fNum/delete',function(req,res){
  var fNum = req.params.fNum;
  var sql = 'DELETE FROM f_board WHERE fNum = ?';
  db.query(sql, [fNum] , function(err, result, fields){
    if(err)
      console.log(err);
    //console.log(result);
    res.redirect('/free_view');
  });
});

router.post('/:fNum/edit',function(req,res){
  var sql = 'UPDATE f_board SET fTitle=?, fCategory=?, fContent=? WHERE fNum=?';
  var fNum = req.params.fNum;
  var title = req.body.fTitle;
  var category = req.body.fCategory;
  var content = req.body.fContent;

  db.query(sql,[
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
router.get('/:fNum/edit',function(req,res){
  var fNum = req.params.fNum
  if(!fNum){
    throw err;
  }else{
    var sql = 'SELECT * FROM f_board WHERE fNum = ?';
    db.query(sql, [fNum], function(err, rows){
      if(err)
        console.log(err);
    //  res.send(rows);
    //  console.log(rows);
    res.render('topic/free_edit',{rows:rows});
    });
  };
  //res.send('edit');
});

router.post('/add',upload.single('upload'), function(req,res){
  var title = req.body.fTitle;
  var category = req.body.fCategory;
  var content = req.body.fContent;
  var did = req.body.fDid;     //나중에 로그인 하고 수정
  var id = req.body.fId;           //나중에 로그인 하고 수정
  var filename = savename;

  var sql = 'INSERT INTO f_board (fTitle, fCategory, fContent, fDid, fId, file) VALUES(?,?,?,?,?,?)';
  db.query(sql, [title, category, content, did, id, savename], function(err, result, fields){
    if(err){
      console.log(err);
    }else{
      res.redirect('/free_view/'+result.info.insertId);
    }
  })
});
router.get('/add', function(req,res){
  res.render('topic/free_add');
});


router.get('/:fNum', function(req,res){
  var fNum = req.params.fNum;
  var sql = 'SELECT * FROM f_board WHERE fNum = ?';
  db.query(sql, [fNum], function(err, rows){
    if(err){
      console.log(err);
    }else{
      //res.send(rows)
      var sql= 'UPDATE f_board SET fHit = fHit+1 WHERE fNum = ?'
      db.query(sql,[fNum],function(err){
        if(err)
          console.log(err);
      });
      res.render('topic/free_detail', {rows,rows});
    }
  })
});

router.get('/', function(req,res,next){
  var sql = 'Select * From f_board order by fNum desc'
  db.query(sql, function(err, rows) {
    if (err)
      throw err;
    res.render('topic/free_view',{rows:rows});
  });
});


module.exports = router;
