/**
 * Created by acidghost on 24/06/14.
 */

var app = angular.module('beardedWookie', ['ngRoute', 'ngResource', 'ui.bootstrap']);

var accessControl = {
  '/': true,
  '/conversations': false
};

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl'
    })
    .when('/conversations', {
      templateUrl: 'templates/conversations.html',
      controller: 'ConversationsCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });

  // use the HTML5 History API
  // $locationProvider.html5Mode(true);
});

app.run(function($rootScope, $window, Auth){

  $rootScope.$on("$locationChangeStart", function(event, next, current) {
    for(var route in accessControl) {
      if(next.indexOf(route) !== -1) {
        if(accessControl[route] === false && Auth.loggedUser() === undefined) {
          event.preventDefault();
          $window.location.href = '#/';
        }
      }
    }
  });

});
