/**
 * Created by acidghost on 24/06/14.
 */

var app = angular.module('beardedWookie');

app.controller('NavCtrl', ['$scope', '$rootScope', '$modal', '$location', 'Auth', function($scope, $rootScope, $modal, $location, Auth) {

  $scope.user = $rootScope.loggedUser();
  $scope.logged = false;

  $scope.checkUser = function() {
    var loggedUser = $rootScope.loggedUser();
    $scope.logged = !!loggedUser;
    $scope.user = loggedUser;
  };

  $scope.getView = function() {
    if($scope.logged) {
      return 'templates/nav/logged.html';
    } else {
      return 'templates/nav/default.html';
    }
  };

  $scope.nav = function(where) {
    $location.path(where);
  };

  $scope.logout = function() {
    Auth.clearCredentials();
    $scope.checkUser();
    $location.path('/');
  };

  $scope.openSignup = function() {
    $modal.open({
      templateUrl: 'templates/modals/signup-modal.html',
      controller: 'SignupCtrl',
      size: 'sm'
    });
  };

  $scope.openLogin = function() {
    var modalInstance = $modal.open({
      templateUrl: 'templates/modals/login-modal.html',
      controller: 'LoginCtrl',
      size: 'sm'
    });

    modalInstance.result.then(function (loggedIn) {
      if(loggedIn) {
        $scope.checkUser();
        $location.path('/conversations');
      }
    });
  };

}]);
