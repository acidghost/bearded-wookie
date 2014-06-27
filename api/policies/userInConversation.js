/**
 * Created by acidghost on 26/06/14.
 */

module.exports = function(req, res, next) {

  if(req.user) {
    var id = req.param('parentid') || req.param('id');
    for(var i in req.user.conversations) {
      var c = req.user.conversations[i];
      if(c.uuid === id) {
        sails.log.debug('User', req.user.uuid, 'allowed in conversation', id);
        return next();
      }
    }
    return res.forbidden();
  } else {
    return res.forbidden();
  }

};
