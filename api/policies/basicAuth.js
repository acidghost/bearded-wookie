/**
 * Created by acidghost on 25/06/14.
 */

var passport = require('passport');

module.exports = function(req, res, next) {
  passport.authenticate('basic', { session: false }, function(err, user, info) {
    sails.log(err, user, info);
    if(err || !user) {
      if(err) sails.log.error(err);
      if(!user) sails.log.info('User not found');
      res.forbidden();
      return;
    }
    return next();
  })(req, res, next);
};
