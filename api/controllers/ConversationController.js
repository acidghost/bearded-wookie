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

  findOne: function(req, res) {
    Conversation
      .findOne({ uuid: req.param('id') })
      .populate('users')
      .populate('messages')
      .exec(function(err, conv) {
        if(err) {
          sails.log.error(err);
          ErrorResolver(err, res);
        } else {
          if(conv) {
            res.ok(conv);
          } else {
            res.notFound();
          }
        }
      });
  },

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
    Conversation.findOne({ uuid: params.parentid }).exec(function(err, conversation) {
      if(err) {
        ErrorResolver(err, res);
      } else {
        if(conversation) {
          User.findOne({ uuid: params.uuid }).populate('conversations').exec(function(err, user) {
            if(err) {
              ErrorResolver(err, res);
            } else {
              if(user) {
                for(var i=0; i<user.conversations.length; i++) {
                  if(user.conversations[i].uuid === conversation.uuid) {
                    return res.badRequest({ error: 'The user is already into the conversation' });
                  }
                }
                conversation.users.add(user.id);
                conversation.save(function(err, c) {
                  if(err) {
                    ErrorResolver(err, res);
                  } else {
                    sails.log.debug('Added user', user.uuid, 'to conversation', conversation.uuid);
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

