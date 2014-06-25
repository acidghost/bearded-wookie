/**
 * Created by acidghost on 25/06/14.
 */

var passport = require('passport');

module.exports = function(req, res, next) {
  passport.authenticate('basic', { session: false }, function(err, user, info) {
    if(err || !user) {
      if(err) sails.log.error(err);
      if(!user) sails.log.info('User not found');
      res.forbidden();
      return;
    }
    req.login(user, function(err) {
      if (err) { return next(err); }
      return next();
    });
  })(req, res, next);
};
