/**
 * Created by acidghost on 21/06/14.
 */

module.exports = function(err, res) {

  sails.log.error(err, err.status);
  if(err.status == '500') {
    res.serverError(err, err.status);
  } else {
    res.badRequest(err, err.status);
  }

};
