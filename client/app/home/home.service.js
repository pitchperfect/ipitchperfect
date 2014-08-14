'use strict';

angular.module('pitchPerfectApp')


.factory('HomeFactory', function($http) {

  var getAllUserDecks = function (getDecksCb, getUserDecksCb) {

    $http.get('/api/userdecks').success(function(userdecksAndDecks) {
      console.log('@home received userdecks & decks', userdecksAndDecks);

      getUserDecksCb(userdecksAndDecks[0]);
      getDecksCb(userdecksAndDecks[1]);
    })
    .error(function(data, status, headers, config) {
      console.log('getAllUserDecks error:', data, status, headers, config);
    });
  };

  var createDeck = function (postDeckObject, submitDeckCb) {
    $http.post('/api/decks', postDeckObject)
    .success(submitDeckCb);
  };


  return {
    getAllUserDecks: getAllUserDecks,
    createDeck: createDeck,
  };

});
