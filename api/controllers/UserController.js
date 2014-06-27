/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  find: function(req, res) {
    res.notFound();
  },

  findOne: function(req, res) {
    User.findOne({ uuid: req.param('id') }).populate('conversations').exec(function(err, user) {
      if(err) {
        ErrorResolver(err, res);
      } else {
        if(user) {
          res.ok(user);
        } else {
          res.notFound({ error: 'Unable to find the requested user' });
        }
      }
    });
  },

  create: function(req, res) {
    User.create({ pass: req.param('pass') }).exec(function(err, user) {
      if(err) {
        ErrorResolver(err, res);
      } else {
        res.ok(user);
      }
    });
  },

  update: function(req, res) {
    var params = req.allParams();
    User.update({ uuid: params.id }, { pass: params.pass }).populate('conversations').exec(function(err, user) {
      if(err) {
        ErrorResolver(err, res);
      } else {
        if(user) {
          res.ok(user);
        } else {
          res.notFound({ error: 'Unable to find the requested user' });
        }
      }
    });
  }

};

