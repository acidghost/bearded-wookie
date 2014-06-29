/**
 * ConversationController
 *
 * @description :: Server-side logic for managing conversations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var findOne = function findOne(req, res) {
  async.auto({
    conversation: function(cb) {
      Conversation
        .findOne({ uuid: req.param('id') || req.param('parentid') })
        .populate('users')
        .populate('messages')
        .exec(cb);
    },
    writers: ['conversation', function(cb, results) {
      User.find({ id: _.pluck(results.conversation.messages, 'writer') }).exec(cb);
    }],
    map: ['writers', function(cb, results) {
      var writers = _.indexBy(results.writers, 'id');
      var conversation = results.conversation;
      conversation.messages = conversation.messages.map(function(msg) {
        msg.writer = writers[msg.writer].toJSON();
        return msg;
      });
      return cb(null, conversation);
    }]
  }, function(err, results) {
    if(err) {
      ErrorResolver(err, res);
    } else {
      if(results.map) {
        return res.json(results.map);
      } else {
        return res.notFound();
      }
    }
  });
};

module.exports = {

  create: function(req, res) {
    Conversation.create().exec(function(err, conversation) {
      if(err) {
        ErrorResolver(err, res);
      } else {
        if(req.user.id) {
          conversation.users.add(req.user.id);
          conversation.save(function(err, conversation) {
            if(err) ErrorResolver(err, res);
            else res.ok(conversation);
          });
        } else {
          res.ok(conversation);
        }
      }
    });
  },

  find: function(req, res) {
    User
      .findOne({ uuid: req.user.uuid })
      .populate('conversations')
      .exec(function(err, user) {
        if(err) {
          ErrorResolver(err, res);
        } else {
          if(user) {
            sails.log.debug('Returning conversations list to user', user.uuid);
            res.ok(user.conversations);
          } else {
            res.forbidden();
          }
        }
      });
  },

  findOne: findOne,

  populate: function(req, res) {
    var relation = req.options.alias;
    var convUUID = req.param('parentid');
    var childUUID = req.param('id');
    var where = childUUID ? { uuid: childUUID } : {};
    sails.log.debug('Populating', relation, 'of conversation', convUUID);
    Conversation
      .findOne({ uuid: convUUID })
      .populate(relation, {
        where: where
      })
      .exec(function(err, conv) {
        if(err) {
          sails.log.error(err);
          ErrorResolver(err, res);
        } else {
          if(conv) {
            res.ok(conv[relation]);
          } else {
            res.notFound();
          }
        }
      });
  },

  add: function(req, res) {
    var params = req.allParams();
    var relation = req.options.alias;
    if (!relation) {
      return res.serverError(new Error('Missing required route option, `req.options.alias`.'));
    }
    // Get the model class of the child in order to figure out the name of
    // the primary key attribute.
    var associationAttr = _.findWhere(Conversation.associations, { alias: relation });
    var ChildModel = sails.models[associationAttr.collection];
    if(ChildModel == undefined) {
      return res.badRequest();
    }

    // `params.uuid` is used for adding users
    // `req.user.uuid` is the auth user for message creation
    var userID = params.uuid || req.user.uuid;

    Conversation.findOne({ uuid: params.parentid }).exec(function(err, conversation) {
      if(err) {
        ErrorResolver(err, res);
      } else {
        if(conversation) {
          var query = User.findOne({ uuid: userID });
          if(relation === 'users') {
            query.populate('conversations');
          }
          query.exec(function(err, user) {
            if(err) {
              ErrorResolver(err, res);
            } else {
              if(user) {
                var entityID = null;
                if(relation === 'users') {
                  for(var i=0; i<user.conversations.length; i++) {
                    if(user.conversations[i].uuid === conversation.uuid) {
                      return res.badRequest({ error: 'The user is already into the conversation' });
                    }
                  }
                  entityID = user.uuid;
                  conversation.users.add(user.id);
                } else if(relation === 'messages') {
                  Message.create(
                    {
                      conversation: conversation.id,
                      writer: user.id,
                      text: params.text
                    }
                  ).exec(function(err, message) {
                      if(err) {
                        return ErrorResolver(err, res);
                      } else {
                        sails.log.debug('Created new message:', JSON.stringify(message));
                        entityID = message.uuid;
                        conversation.messages.add(message.id);
                      }
                    });
                }
                conversation.save(function(err, c) {
                  if(err) {
                    ErrorResolver(err, res);
                  } else {
                    sails.log.debug('Added', relation, entityID, 'to conversation', conversation.uuid);
                    //res.ok(c);
                    findOne(req, res);
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

  remove: function(req, res) {
    var params = req.allParams();
    Conversation.findOne({ uuid: params.parentid }).exec(function(err, conversation) {
      if(err) {
        ErrorResolver(err, res);
      } else {
        if(conversation) {
          User.findOne({ uuid: params.id }).populate('conversations').exec(function(err, user) {
            if(err) {
              ErrorResolver(err, res);
            } else {
              if(user) {
                var inConversation = false;
                for(var i=0; i<user.conversations.length && !inConversation; i++) {
                  if(user.conversations[i].uuid === conversation.uuid) {
                    inConversation = true;
                    conversation.users.remove(user.id);
                    conversation.save(function(err, c) {
                      if(err) {
                        ErrorResolver(err, res);
                      } else {
                        sails.log.debug('Removed user', user.uuid, 'from conversation', c.uuid);
                        if(c.users.length == 0) {
                          c.destroy(function(err) {
                            if(err) {
                              ErrorResolver(err, res);
                            } else {
                              sails.log.debug('Destroyed conversation which doesn\'t have users', c.uuid);
                              res.send(204);
                            }
                          });
                        } else {
                          // If the requesting user is the same that has
                          // been removed, do not present content to him
                          return (req.user.uuid === user.uuid) ? res.send(204) : res.ok(c);
                        }
                      }
                    });
                  }
                }
                if(!inConversation) return res.badRequest({ error: 'The user is not into the conversation' });
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

  destroy: function(req, res) {
    Conversation.destroy({ uuid: req.param('id') }).exec(function(err, conversation) {
      if(err) {
        return ErrorResolver(err, res);
      }
      if(!conversation) {
        return res.notFound();
      }
      sails.log.debug('Destroyed conversation', conversation.uuid);
      return res.send(204);
    });
  }

};

