/**
 * Created by acidghost on 21/06/14.
 */

var passport = require('passport');

module.exports.express = {
  customMiddleware: function (app) {

    app.use(passport.initialize());
    app.use(passport.session());

  }
};
