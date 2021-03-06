/**
 * Created by acidghost on 27/06/14.
 */

var app = angular.module('beardedWookie');

app.controller('SingleConversationCtrl', ['$scope', '$modal', 'Conversation', function($scope, $modal, Conversation) {

  $scope.formData = { message: '', autoScroll: true };

  $scope.getView = function() {
    return 'templates/conversation.html'
  };

  var updateUsers = function(users) {
    $scope.$emit('usersChangedInConversation', users);
  };

  $scope.$watch('conversation.messages', function() {
    if($scope.formData.autoScroll) {
      var tray = jQuery('#conversation-tray')[0];
      if(tray != undefined) {
        jQuery(tray).animate({ scrollTop: tray.scrollHeight}, 1000);
      }
    }
  });

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

    modalInstance.result.then(updateUsers);
  };

  $scope.removeUser = function() {
    var modalInstance = $modal.open({
      templateUrl: 'templates/modals/remove-user-modal.html',
      controller: RemoveUserCtrl,
      size: 'sm',
      resolve: {
        conversation: function() {
          return $scope.conversation;
        }
      }
    });

    modalInstance.result.then(updateUsers);
  };

  $scope.postMessage = function(message) {
    Conversation.postMessage({ id: $scope.conversation.uuid, text: message },
      function(conversation) {
        $scope.conversation.messages = conversation.messages;
        $scope.formData.message = '';
      },
      function(err) {
        console.log(err);
      }
    );
  };

}]);

var AddUserCtrl = ['$scope', '$modalInstance', 'Conversation', 'conversation', function($scope, $modalInstance, Conversation, conversation) {

  $scope.alerts = [];
  var users = conversation.users;

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.ok = function(uuid) {
    Conversation.addUser({ id: conversation.uuid, uuid: uuid },
      function(conversation) {
        $scope.alerts.push({ type: 'success', msg: 'The user '+uuid+' has been added to the conversation!' });
        users = conversation.users;
      },
      function(err) {
        $scope.alerts.push({ type: 'danger', msg: err.data.error })
      }
    );
  };

  $scope.cancel = function() {
    $modalInstance.close(users);
  };

}];

var RemoveUserCtrl = ['$scope', '$modalInstance', 'Conversation', 'conversation', function($scope, $modalInstance, Conversation, conversation) {

  $scope.alerts = [];
  $scope.user = $scope.loggedUser();
  $scope.actualUsers = conversation.users;
  var users = conversation.users;

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.removeUser = function(uuid, index) {
    Conversation.removeUser({ id: conversation.uuid, uid: uuid },
      function(conversation) {
        $scope.alerts.push({ type: 'success', msg: 'The user '+uuid+' has been removed from the conversation!' });
        $scope.actualUsers.splice(index, 1);
        users = conversation.users;
      },
      function(err) {
        $scope.alerts.push({ type: 'danger', msg: err.data.error || 'Unable to remove the desired user...' })
      }
    );
  };

  $scope.cancel = function() {
    $modalInstance.close(users);
  };

}];
