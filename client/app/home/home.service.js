'use strict';

angular.module('pitchPerfectApp')


.factory('HomeFactory', function($http) {


  var createDeck = function (postDeckObject, callback) {
    $http.post('/api/decks', postDeckObject)
    .success(function() {
      callback();
    });
  };


  return {
    createDeck: createDeck,
  };

});
