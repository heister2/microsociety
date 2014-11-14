var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // update User

  passport.use('local-update', new LocalStrategy({
    usernameField: 'idNum',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, idNum, password, done) {
    process.nextTick(function() {
      var user = req.user;
      user.businessID = req.param('businessID');
      user.job = req.param('job');

      user.save(function(err) {
        if (err)
          throw err;
        return done(null, user);
      });
    });
  }));

  // login 
  passport.use('local-login', new LocalStrategy({
    usernameField: 'idNum',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, idNum, password, done) {
    User.findOne({'idNum': idNum}, function(err, user) {
      if (err)
        return done(err);
      if (!user)
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      if (!user.validPassword(password)) 
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong PIN!'));
      return done(null, user);
    });
  }));
}