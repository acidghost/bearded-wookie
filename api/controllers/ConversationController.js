/**
 * ConversationController
 *
 * @description :: Server-side logic for managing conversations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  create: function(req, res) {
    Conversation.create().exec(function(err, conversation) {
      if(err) {
        ErrorResolver(err, res);
      } else {
        res.ok(conversation);
      }
    });
  },

  add: function(req, res) {
    var params = req.allParams();
    Conversation.findOne(params.parentid).populate('users').exec(function(err, conversation) {
      if(err) {
        ErrorResolver(err, res);
      } else {
        if(conversation) {
          User.findOne(params.uuid).exec(function(err, user) {
            if(err) {
              ErrorResolver(err, res);
            } else {
              if(user) {
                for(var i=0; i<conversation.users.length; i++) {
                  if(conversation.users[i].uuid === user.uuid) {
                    return res.badRequest({ error: 'The user is already into the conversation' });
                  }
                }
                conversation.users.add(user.uuid);
                conversation.save(function(err, c) {
                  if(err) {
                    ErrorResolver(err, res);
                  } else {
                    res.ok(c);
                  }
                });
              } else {
                res.notFound({ error: 'This user ID does not exists' });
              }
            }
          });
        } else {
          res.notFound({ error: 'Unable to find the requested conversation' });
        }
      }
    });
  },

  remove: function(req, res) { res.ok('remove()') }

};

