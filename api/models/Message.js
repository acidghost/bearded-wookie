/**
* Message.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  autoUpdatedAt: false,

  attributes: {
    uuid: {
      type: 'string',
      index: true,
      required: true,
      unique: true,
      defaultsTo: sails.config.models.defaultUUID
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
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.id;
      delete obj.conversation;
      return obj;
    }
  },

  afterCreate: function(newRecord, cb) {
    generateUUID(newRecord, cb, 'message');
  }
};

