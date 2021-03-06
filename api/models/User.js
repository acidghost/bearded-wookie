/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt');

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
      index: true,
      required: true,
      unique: true,
      defaultsTo: sails.config.models.defaultUUID
    },
    pass: {
      type: 'string',
      required: true
    },
    conversations: {
      collection: 'Conversation',
      via: 'users',
      dominant: true
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.id;
      delete obj.pass;
      return obj;
    }
  },

  beforeCreate: function(values, cb) {
    encryptPass(values, cb);
  },

  afterCreate: function(newRecord, cb) {
    generateUUID(newRecord, cb, 'user');
  },

  beforeUpdate: function(values, cb) {
    if(values.pass) {
      encryptPass(values, cb);
    } else {
      cb();
    }
  }
};

