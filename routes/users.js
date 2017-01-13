module.exports = function(passport){
  var router = require('express').Router();
  var db = require('../config/db')();
  var pbkdf2password = require("pbkdf2-password");
  var hasher = pbkdf2password();

  router.post('/login'
    ,passport.authenticate(
      'local',
      {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: false
      }
    )
  );

  router.post('/register', function(req,res){
    hasher({password:req.body.password},function(err, pass, salt, hash){
      var sql = 'INSERT INTO user(userId, userName, userPw, userSalt, userDid, userEmail) VALUES(?, ?, ?, ?, ?, ?)';
      db.query(sql,[
        'local:'+req.body.username,
        req.body.username,
        hash,
        salt,
        req.body.did,
        req.body.email
      ], function(err,result){
        if(err){
          console.log(err);
        } else {
          //res.redirect('/');
          // req.login(user, function(err){
          //   req.session.save(function(){
          //     res.redirect('/');
          //   });
          // });
        }

        //console.log(result);
      });
    });
  });

  router.get('/register', function(req, res){
    res.render('users/register');
  });

  router.get('/test', function(req,res){
    res.send(req.session.passport.user)
  });

 return router;
}
