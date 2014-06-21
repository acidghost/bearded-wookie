/**
* Conversation.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var shortid= require('shortid');

module.exports = {

  attributes: {
    uuid: {
      type: 'string',
      unique: true,
      primaryKey: true
    },
    users: {
      collection: 'User',
      via: 'conversations'
    },
    messages: {
      collection: 'Message',
      via: 'conversation'
    }
  },

  beforeCreate: function(values, cb) {
    values.uuid = shortid.generate();
    cb();
  }
};

