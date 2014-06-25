/**
 * Created by acidghost on 25/06/14.
 */

module.exports = function(req, res, next) {

  if(req.user) {
    if(req.param('id') === req.user.uuid) {
      return next();
    }
  }

  return res.forbidden();

};
