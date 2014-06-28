/**
 * Created by acidghost on 26/06/14.
 */

var app = angular.module('beardedWookie');

app.controller('ConversationsCtrl', ['$scope', 'conv', 'Conversation', function($scope, conv, Conversation) {

  $scope.isListCollapsed = false;
  $scope.user = $scope.loggedUser();
  $scope.conversation = conv;
  $scope.conversationSelected = conv != null;

  $scope.createConversation = function() {
    Conversation.create(null,
      function(conversation) {
        $scope.user.conversations.push(conversation);
        $scope.setUser($scope.user);
      },
      function(err) {
        console.log(err);
      }
    );
  };

  $scope.$on('usersChangedInConversation', function(event, users) {
    $scope.conversation.users = users;
  });

}]);
