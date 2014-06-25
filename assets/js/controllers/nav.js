/**
 * Created by acidghost on 24/06/14.
 */

var app = angular.module('beardedWookie');

app.controller('NavCtrl', function($scope, $modal) {

  $scope.getView = function() {
    return 'templates/nav/default.html';
  };

  $scope.openSignup = function() {
    var modalInstance = $modal.open({
      templateUrl: 'templates/modals/signup-modal.html',
      controller: 'SignupCtrl',
      size: 'sm'
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    });
  };

  $scope.openLogin = function() {
    var modalInstance = $modal.open({
      templateUrl: 'templates/modals/login-modal.html',
      controller: 'LoginCtrl',
      size: 'sm'
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    });
  };

});
