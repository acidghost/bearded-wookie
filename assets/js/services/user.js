/**
 * Created by acidghost on 25/06/14.
 */

var app = angular.module('beardedWookie');

app.factory('User', function($resource) {

  return $resource('/api/user/:id', null, {
    'get': { method: 'GET' },
    'create': { method: 'POST' },
    'update': { method: 'PUT' },
    'destroy': { method: 'DELETE' }
  });

});
