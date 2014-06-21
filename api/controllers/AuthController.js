/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var passport = require('passport');

module.exports = {
	_config: {
    actions: false,
    rest: false,
    shortcuts: false
  },

  login: function(req, res) {
    passport.authenticate('local', function(err, user, info) {
      if(err || !user) {
        if(err) sails.log.error(err);
        if(!user) sails.log.info('User ' + user + ' not found');
        res.forbidden();
        return;
      }
      req.login(user, function(err) {
        if(err) {
          sails.log.error(err);
          res.forbidden();
          return;
        }
        res.ok(user);
      });
    })(req, res);
  }
};

