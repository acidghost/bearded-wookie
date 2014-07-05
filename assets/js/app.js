/**
 * Created by acidghost on 24/06/14.
 */

var app = angular.module('beardedWookie', ['ngRoute', 'ngResource', 'ui.bootstrap']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/home.html',
      controller: 'HomeCtrl',
      publicAccess: true
    })
    .when('/conversations', {
      templateUrl: 'templates/conversations.html',
      controller: 'ConversationsCtrl',
      resolve: {
        conv: function() {
          return null;
        },
        conversations: ['Conversation', function(Conversation) {
          return Conversation.getAll({id: '', entity: ''}).$promise;
        }]
      }
    })
    .when('/conversations/:id', {
      templateUrl: 'templates/conversations.html',
      controller: 'ConversationsCtrl',
      resolve: {
        conv: ['$route', 'socket', function($route, socket) {
          return socket.get('/api/conversation/'+$route.current.params.id);
        }],
        conversations: ['Conversation', function(Conversation) {
          return Conversation.getAll({id: '', entity: ''}).$promise;
        }]
      }
    })
    .otherwise({
      redirectTo: '/'
    });

  // use the HTML5 History API
  // $locationProvider.html5Mode(true);
}]);

app.run(['$rootScope', '$location', 'Auth', function($rootScope, $location, Auth){

  $rootScope.loggedUser = Auth.loggedUser;
  $rootScope.setUser = Auth.setUser;

  $rootScope.$on("$routeChangeStart", function(event, next, current) {
    var publicAccess = next.publicAccess || false;
    if(!publicAccess && Auth.loggedUser() == undefined) {
      event.preventDefault();
      $location.path('/').replace();
    }

    if (next.$$route && next.$$route.resolve) {
      // Show a loading message until promises are not resolved
      $rootScope.loadingView = true;
    }
  });

  $rootScope.$on('$routeChangeSuccess', function(e, curr, prev) {
    // Hide loading message
    $rootScope.loadingView = false;
  });

  var count = 0;
  function rotate() {
    var loadingViewElm = document.querySelector('#loading-view div .glyphicon');
    loadingViewElm.style.MozTransform = 'rotate('+count+'deg)';
    loadingViewElm.style.WebkitTransform = 'rotate('+count+'deg)';
    loadingViewElm.style.Transform = 'rotate('+count+'deg)';
    if (count==360) { count = 0 }
    count+=45;
    window.setTimeout(rotate, 80);
  }
  window.setTimeout(rotate, 80);

}]);
