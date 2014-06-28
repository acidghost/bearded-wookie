/**
 * Created by acidghost on 25/06/14.
 */

var app = angular.module('beardedWookie');

app.factory('Auth', ['Base64', 'SessionStorage', '$http', function(Base64, SessionStorage, $http) {

  $http.defaults.headers.common['Authorization'] = 'Basic ' + SessionStorage.get('authdata');

  return {
    setCredentials: function (username, password) {
      var encoded = Base64.encode(username + ':' + password);
      $http.defaults.headers.common['Authorization'] = 'Basic ' + encoded;
      SessionStorage.put('authdata', encoded);
    },
    clearCredentials: function () {
      document.execCommand("ClearAuthenticationCache");
      SessionStorage.remove('user');
      SessionStorage.remove('authdata');
      $http.defaults.headers.common['Authorization'] = 'Basic ';
    },
    setUser: function(user) {
      SessionStorage.put('user', JSON.stringify(user));
    },
    loggedUser: function() {
      return JSON.parse(SessionStorage.get('user'));
    }
  };

}]);
