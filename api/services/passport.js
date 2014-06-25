/**
 * Created by acidghost on 21/06/14.
 */
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    passHTTP = require('passport-http'),
    DigestStrategy = passHTTP.DigestStrategy,
    BasicStrategy = passHTTP.BasicStrategy,
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
        userPassAuth(user, pass, done);
      });
    }
  )
);

// Digest Strategy
passport.use(new DigestStrategy({ qop: 'auth' },
  function(ID, done) {
    User.findOne({ uuid: ID }).exec(function (err, user) {
      sails.log(err, user);
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, user.pass);
    });
  },
  function(params, done) {
    // validate nonces as necessary
    done(null, true)
  }
));

// Use the BasicStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.
passport.use(new BasicStrategy({
  },
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure.  Otherwise, return the authenticated `user`.
      userPassAuth(username, password, done);
    });
  }
));

var userPassAuth = function(uname, password, done) {
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
};
