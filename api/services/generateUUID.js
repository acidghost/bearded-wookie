/**
 * Created by acidghost on 26/06/14.
 */

module.exports = function(newRecord, cb, model) {

  if(newRecord.uuid === sails.config.models.defaultUUID) {
    // Get a timestamp in seconds
    var timestamp = Math.floor(new Date().getTime()/1000);
    // Create a date with the timestamp
    var timestampDate = new Date(timestamp*1000).getTime();
    newRecord.uuid = sails.config.globals.hashids.encrypt(timestampDate);
    sails.models[model].update(newRecord.id, {uuid: newRecord.uuid}).exec(function(e, u) {
      if(e) {
        sails.log.error(model + ' afterCreate: ', e);
        cb(e);
      } else {
        sails.log.info('Generated uuid for ' + model + ': ', u[0].uuid);
        cb();
      }
    });
  } else {
    cb(false);
  }

};
