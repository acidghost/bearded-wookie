/**
 * Created by acidghost on 27/06/14.
 */

var app = angular.module('beardedWookie');

app.controller('SingleConversationCtrl', ['$scope', 'Conversation', function($scope, Conversation) {

  $scope.getView = function() {
    return 'templates/conversation.html'
  };

}]);
