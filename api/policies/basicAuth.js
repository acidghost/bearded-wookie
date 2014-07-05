/**
 * Created by acidghost on 25/06/14.
 */

var passport = require('passport');

module.exports = function(req, res, next) {
  if(req.isSocket) {
    if(req.body.authorization) {
      req.headers['authorization'] = req.body.authorization;
    }
  }
  passport.authenticate('basic', { session: false }, function(err, user, info) {
    if(err || !user) {
      if(err) sails.log.error(err);
      if(!user) sails.log.info('User not found');
      res.forbidden();
      return;
    }
    if(req.isSocket) {
      sails.log.info('Socket login...', 'Next is', req._parsedUrl.path);
      req.user = user;
      return next();
    } else {
      req.login(user, function(err) {
        if (err) { return next(err); }
        return next();
      });
    }
  })(req, res, next);
};
