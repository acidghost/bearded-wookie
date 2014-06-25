/**
 * Created by acidghost on 24/06/14.
 */

var app = angular.module('beardedWookie');

app.controller('LoginCtrl', function($scope, $modalInstance) {

  $scope.cancel = function() {
    $modalInstance.dismiss();
  };

});
