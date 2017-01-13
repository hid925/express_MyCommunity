module.exports =function(app){
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;
  var pbkdf2password = require("pbkdf2-password");
  var hasher = pbkdf2password();
  var db = require('../config/db')();

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    console.log('serializeUser',user);
    done(null, user.userId);
  });

  passport.deserializeUser(function(id, done) {
    console.log('deserializeUser',id);
    var sql = "SELECT * FROM user WHERE userId=?";
    db.query(sql,[id],function(err,results){
      //console.log(sql,err,results);
       if(err){
         console.log(err);
         done('There is no user');
       } else {
         done(null, results[0]);
       }
    });
  });

  passport.use(new LocalStrategy(
    function(username, password, done){
        var uname='local:'+username;
        var pwd=password;
        var sql='SELECT * FROM user WHERE userId=?';
        console.log(uname,pwd,sql);
        db.query(sql, [uname],function(err, results){
          console.log(results);
          if(err){
            return done('no user');
          }
          var user=results[0];
          //console.log(user);
          return hasher({password:pwd, salt:user.userSalt}, function(err, pass, salt, hash){
            if(hash === user.userPw){
              console.log('LocalStrategy',user);
              done(null, user); //세션에 user로?
            }else{
              console.log('비번틀림')
              done(null, false);
            }
          });
        });
      }
  ));

  return passport
}
