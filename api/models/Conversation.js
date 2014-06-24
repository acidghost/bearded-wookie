/**
* Conversation.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    uuid: {
      type: 'string',
      required: true,
      unique: true,
      primaryKey: true,
      defaultsTo: sails.config.globals.shortid.generate
    },
    users: {
      collection: 'User',
      via: 'conversations'
    },
    messages: {
      collection: 'Message',
      via: 'conversation'
    }
  }
};

