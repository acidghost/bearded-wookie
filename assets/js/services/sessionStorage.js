/**
 * Created by acidghost on 25/06/14.
 */

var app = angular.module('beardedWookie');

app.factory('SessionStorage', function() {

  return {
    get: function(key) {
      return sessionStorage.getItem(key);
    },
    put: function(key, value) {
      sessionStorage.setItem(key, value);
    },
    remove: function(key) {
      sessionStorage.removeItem(key);
    }
  };

});
