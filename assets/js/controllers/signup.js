/**
 * Created by acidghost on 24/06/14.
 */

var app = angular.module('beardedWookie');

app.controller('SignupCtrl', ['$scope', '$modalInstance', 'User', function($scope, $modalInstance, User) {

  $scope.formData = {};
  $scope.alerts = [];
  $scope.hideForm = false;

  $scope.addAlert = function(type, msg) {
    $scope.alerts.push({type: type, msg: msg});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.ok = function() {
    User.create($scope.formData,
      function(user) {
        $scope.addAlert('success', 'Congratulations, you successfully signed up! Your ID is: ' + user.uuid);
        $scope.hideForm = true;
      },
      function(err) {
        if(!angular.isString(err.data.error)) {
          $scope.addAlert('danger', 'Sorry, we\'re unable to serve your request right now... Try again in a few minutes...');
        } else {
          $scope.addAlert('danger', err.data.error);
        }
        $scope.hideForm = false;
      }
    );
  };

  $scope.cancel = function() {
    $modalInstance.dismiss();
  };

}]);
