/**
 * Created by acidghost on 21/06/14.
 */
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
  done(null, user.uuid);
});

passport.deserializeUser(function(id, done) {
  User.findOne({ uuid: id }, function (err, user) {
    done(err, user);
  });
});

/**
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: 'uuid',
      passwordField: 'pass'
    },
    function(uname, password, done) {
      process.nextTick(function() {
        User.findOne(uname).exec(function(err, user) {
          if(err) {
            sails.log.error(err);
            return done(err);
          }

          if(user == null || user == 'undefined') {
            return done(null, false, { message: 'Unknown user: '+uname });
          }

          bcrypt.compare(password, user.pass, function(err, match) {
            if(err) {
              sails.log.error(err);
              return done(err);
            }
            if(!match) {
              return done(null, false, { message: 'Invalid password' });
            }
            return done(null, user);
          });
        });
      });
    }
  )
);
