/**
 * Created by acidghost on 26/06/14.
 */

var app = angular.module('beardedWookie');

app.factory('Conversation', ['$resource', function($resource) {

  return $resource('/api/conversation/:id/:entity/:uid',
    {
      id: '@id',
      entity: '@entity',
      uid: '@uid'
    },
    {
      'create': { method: 'POST', params: { entity: '', uid: '' } },
      'get': { method: 'GET', params: { entity: '', uid: '' } },
      'getAll': { method: 'GET', isArray: true, params: { uid: '' } },
      'destroy': { method: 'DELETE' },
      'addUser': { method: 'POST', params: { entity: 'users', uid: '' } }
    }
  );

}]);
