/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var shortid = require('shortid');

module.exports = {

  find: function(req, res) {
    res.notFound();
  },

  findOne: function(req, res) {
    User.findOne(req.param('id')).exec(function(err, user) {
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
    User.create({ uuid: shortid.generate(), pass: '' }).exec(function(err, user) {
      if(err) {
        ErrorResolver(err, res);
      } else {
        res.ok(user);
      }
    });
  },

  update: function(req, res) {
    var params = req.allParams();
    User.update({ uuid: params.id, pass: '' }, { pass: params.pass }).exec(function(err, user) {
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

