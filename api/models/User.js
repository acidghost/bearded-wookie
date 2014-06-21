/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt'),
    shortid = require('shortid');

var encryptPass = function(values, cb) {
  // Encrypt password
  bcrypt.hash(values.pass, 10, function(err, hash) {
    if(err) return cb(err);
    values.pass = hash;
    cb();
  });
};

module.exports = {

  attributes: {
    uuid: {
      type: 'string',
      primaryKey: true,
      required: true,
      unique: true,
      defaultsTo: shortid.generate
    },
    pass: {
      type: 'string'
    },
    conversations: {
      collection: 'Conversation',
      via: 'users'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.pass;
      return obj;
    }
  },

  beforeCreate: function(values, cb) {
    if(values.pass && values.pass != '') {
      encryptPass(values, cb);
    } else {
      cb();
    }
  },

  beforeUpdate: function(values, cb) {
    if(values.pass) {
      encryptPass(values, cb);
    } else {
      cb();
    }
  }
};

