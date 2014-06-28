/**
 * Created by acidghost on 24/06/14.
 */

var app = angular.module('beardedWookie', ['ngRoute', 'ngResource', 'ui.bootstrap']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl',
      publicAccess: true
    })
    .when('/conversations', {
      templateUrl: 'templates/conversations.html',
      controller: 'ConversationsCtrl',
      resolve: {
        conv: function() {
          return null;
        }
      }
    })
    .when('/conversations/:id', {
      templateUrl: 'templates/conversations.html',
      controller: 'ConversationsCtrl',
      resolve: {
        conv: ['$route', 'Conversation', function($route, Conversation) {
          return Conversation.get({ id: $route.current.params.id });
        }]
      }
    })
    .otherwise({
      redirectTo: '/'
    });

  // use the HTML5 History API
  // $locationProvider.html5Mode(true);
}]);

app.run(['$rootScope', '$location', 'Auth', function($rootScope, $location, Auth){

  $rootScope.loggedUser = Auth.loggedUser;
  $rootScope.setUser = Auth.setUser;

  $rootScope.$on("$routeChangeStart", function(event, next, current) {
    var publicAccess = next.publicAccess || false;
    if(!publicAccess && Auth.loggedUser() == undefined) {
      event.preventDefault();
      $location.path('/').replace();
    }
  });

}]);
