/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var bcrypt = require('bcrypt');

module.exports = {

  attributes: {
    uuid: {
      type: 'string',
      primaryKey: true,
      //required: true,
      unique: true
    },
    pass: {
      type: 'string'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.pass;
      return obj;
    }
  },

  beforeUpdate: function(values, cb) {
    if(values.pass) {
      // Encrypt password
      var p = values.pass;
      bcrypt.hash(values.pass, 10, function(err, hash) {
        if(err) return cb(err);
        values.pass = hash;
        cb();
      });
    } else {
      cb();
    }
  }
};

