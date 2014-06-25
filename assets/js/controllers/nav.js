/**
 * Created by acidghost on 24/06/14.
 */

var app = angular.module('beardedWookie');

app.controller('NavCtrl', ['$scope', '$modal', '$location', 'Auth', function($scope, $modal, $location, Auth) {

  $scope.logged = false;
  $scope.uuid = Auth.loggedUser;

  $scope.getView = function() {
    if($scope.logged) {
      return 'templates/nav/logged.html';
    } else {
      return 'templates/nav/default.html';
    }
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
      $scope.logged = loggedIn;
      $location.path('/conversations');
    });
  };

}]);
