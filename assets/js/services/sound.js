/**
 * Created by acidghost on 05/07/14.
 */

var app = angular.module('beardedWookie');

app.factory('sound', function() {

  var newMessage = new buzz.sound('/sounds/gem-ping', {
    formats: [ 'wav' ]
  });

  return {
    newMessage: function() { newMessage.play(); }
  };

});
