/**
 * Created by acidghost on 05/07/14.
 */

var app = angular.module('beardedWookie');

app.factory('socket', ['$q', '$timeout', 'Auth', function($q, $timeout, Auth) {

  var httpVerbs = ['get', 'post', 'put', 'delete'],
      eventNames = ['on', 'once'];

  var socket = io.socket;

  var defer = function () {
    var deferred = $q.defer(),
      promise = deferred.promise;

    promise.success = function (fn) {
      promise.then(fn);
      return promise;
    };

    promise.error = function (fn) {
      promise.then(null, fn);
      return promise;
    };

    return deferred;
  };

  var resolveOrReject = function (deferred, data) {
    // Make sure what is passed is an object that has a status that is a number and if that status is no 2xx, reject.
    if (data && angular.isObject(data) && data.status && !isNaN(data.status) && Math.floor(data.status / 100) !== 2) {
      deferred.reject(data);
    } else {
      deferred.resolve(data);
    }
  };

  var promisify = function(verb) {
    socket['legacy_' + verb] = socket[verb];
    socket[verb] = function (url, data, cb) {
      var deferred = defer();
      if (cb === undefined && angular.isFunction(data)) {
        cb = data;
        data = {};
      }
      if(cb === undefined) {
        cb = function(d) {return d};
        data = {};
      }
      data.authorization = Auth.loggedUser().authString;
      //deferred.promise.then(cb);
      socket['legacy_' + verb](url, data, function (result) {
        resolveOrReject(deferred, result);
      });
      return deferred.promise;
    };
  };

  var angularify = function (cb, data) {
    $timeout(function () {
      cb(data);
    });
  };

  var wrapEvent = function (eventName) {
    socket['legacy_' + eventName] = socket[eventName];
    socket[eventName] = function (event, cb) {
      if (cb !== null && angular.isFunction(cb)) {
        socket['legacy_' + eventName](event, function (result) {
          angularify(cb, result);
        });
      }
    };
  };

  angular.forEach(httpVerbs, promisify);
  angular.forEach(eventNames, wrapEvent);

  return socket;

}]);
