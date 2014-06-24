/**
* Message.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    uuid: {
      type: 'string',
      primaryKey: true,
      required: true,
      unique: true,
      defaultsTo: sails.config.globals.shortid.generate
    },
    writer: {
      model: 'User',
      required: true
    },
    conversation: {
      model: 'Conversation',
      required: true
    },
    text: {
      type: 'string',
      required: true
    }
  }
};

