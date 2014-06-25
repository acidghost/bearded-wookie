/**
 * Created by acidghost on 24/06/14.
 */

var app = angular.module('beardedWookie');

app.controller('LoginCtrl', ['$scope', '$modalInstance', 'Auth', 'User', function($scope, $modalInstance, Auth, User) {

  $scope.alerts = [];
  $scope.hideForm = false;

  $scope.addAlert = function(type, msg) {
    $scope.alerts.push({type: type, msg: msg});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.ok = function(user) {
    Auth.setCredentials(user.uuid, user.pass);
    User.get({ id: user.uuid },
      function(user) {
        $scope.addAlert('success', 'Successfully logged in!');
        $scope.hideForm = true;
      },
      function(err) {
        $scope.addAlert('danger', 'ID or password are wrong...');
        Auth.clearCredentials();
      }
    );
  };

  $scope.cancel = function() {
    // This means that return true when the
    // login successes false otherwise
    $modalInstance.close($scope.hideForm);
  };

}]);
