/**
 * Created by acidghost on 26/06/14.
 */

var app = angular.module('beardedWookie');

app.controller('ConversationsCtrl', ['$scope', 'conv', 'conversations', 'Conversation', 'socket', 'sound', function($scope, conv, conversations, Conversation, socket, sound) {

  $scope.isListCollapsed = false;
  $scope.user = $scope.loggedUser();
  $scope.user.conversations = conversations;
  $scope.conversation = conv;
  $scope.conversationSelected = conv != null;

  $scope.setUser($scope.user);

  var conversationUpdate = function(data) {
    console.log(data);
    if (data.attribute === 'users') {
    } else if (data.attribute === 'messages') {
      socket.get('/api/conversation/' + data.id).success(
        function (d) {
          if ($scope.conversationSelected && data.id == $scope.conversation.uuid) {
            $scope.conversation = d;
          } else if (data.verb == 'addedTo') {
            sound.newMessage();
          }
          var indexed = _.indexBy($scope.user.conversations, 'uuid');
          $scope.user.conversations = _.map(indexed, function (element, key) {
            return (key == data.id ? d : element);
          });
        }
      );
    }
  };
  socket.on('conversation', conversationUpdate);

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
