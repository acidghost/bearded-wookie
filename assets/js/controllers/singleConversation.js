/**
 * Created by acidghost on 27/06/14.
 */

var app = angular.module('beardedWookie');

app.controller('SingleConversationCtrl', ['$scope', '$modal', function($scope, $modal) {

  $scope.getView = function() {
    return 'templates/conversation.html'
  };

  $scope.addUser = function() {
    var modalInstance = $modal.open({
      templateUrl: 'templates/modals/add-user-modal.html',
      controller: AddUserCtrl,
      size: 'sm',
      resolve: {
        conversation: function() {
          return $scope.conversation;
        }
      }
    });

    modalInstance.result.then(function(addedUsers) {
      $scope.$emit('usersAddedToConversation', addedUsers);
    });
  };

  $scope.removeUser = function() {};

}]);

var AddUserCtrl = ['$scope', '$modalInstance', 'Conversation', 'conversation', function($scope, $modalInstance, Conversation, conversation) {

  $scope.alerts = [];
  var addedUsers = [];

  $scope.cloneAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.ok = function(uuid) {
    Conversation.addUser({ id: conversation.uuid, uuid: uuid },
      function(conversation) {
        $scope.alerts.push({ type: 'success', msg: 'The user '+uuid+' has been added to the conversation!' });
        addedUsers.push({ uuid: uuid });
      },
      function(err) {
        $scope.alerts.push({ type: 'danger', msg: err.data.error })
      }
    );
  };

  $scope.cancel = function() {
    $modalInstance.close(addedUsers);
  };

}];
