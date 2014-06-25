/**
 * Created by acidghost on 24/06/14.
 */

var app = angular.module('beardedWookie', ['ngRoute', 'ngResource', 'ui.bootstrap']);

app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });

  // use the HTML5 History API
  $locationProvider.html5Mode(true);
});
