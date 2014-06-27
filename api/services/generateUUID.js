/**
 * Created by acidghost on 26/06/14.
 */

module.exports = function(newRecord, cb, model) {

  if(newRecord.uuid === sails.config.models.defaultUUID) {
    newRecord.uuid = sails.config.globals.hashids.encrypt(newRecord.id);
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
