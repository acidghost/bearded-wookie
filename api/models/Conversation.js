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
      index: true,
      defaultsTo: sails.config.models.defaultUUID
    },
    users: {
      collection: 'User',
      via: 'conversations'
    },
    messages: {
      collection: 'Message',
      via: 'conversation'
    },

    toJSON: function() {
      var obj = this.toObject();
      delete obj.id;
      return obj;
    }
  },

  afterCreate: function(newRecord, cb) {
    generateUUID(newRecord, cb, 'conversation');
  },

  /*
  afterUpdate: function(newRecord, cb) {
    sails.log.info('conversation afterUpdate', newRecord);
    if(newRecord.users.length == 0) {
      Conversation.destroy(newRecord.id).exec(function(err) {
        if(err) {
          sails.log.error(err);
          cb(err);
        } else {
          cb();
        }
      });
    } else {
      cb();
    }
  }
  */
};

