var router = require('express').Router();
var db = require('../../config/db')();


// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.get('/login', function(req,res){
  //로그인 처리
  res.redirect('/');
})


router.post('/register', function(req,res){
  var id = req.body.id;
  var pw = req.body.pw;
  var did = req.body.did;
  var email = req.body.email;

  //디비에 추가할자리

  res.redirect('/');
});

router.get('/register', function(req, res){
  res.render('users/register');
});


module.exports = router;
