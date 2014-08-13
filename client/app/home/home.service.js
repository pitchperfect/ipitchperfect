'use strict';

angular.module('pitchPerfectApp')


.factory('HomeFactory', function($http) {
  
  var getAllUserDecks = function (getDecksCb, getUserDecksCb) {

    $http.get('/api/userdecks').success(function(allUserDecks) {
      console.log('@home received userdecks', allUserDecks);

      getAllDecks(getDecksCb);
      getUserDecksCb(allUserDecks);
    })
    .error(function(data, status, headers, config) {
      console.log('getAllUserDecks error:', data, status, headers, config);
    });
  };


    //var getAllUserDecksReference = this.getAllUserDecks;
  var getAllDecks = function (getDecksCb) {

    $http.get('/api/decks')
    .success(function(allDecks) {
      console.log('@home received decks', allDecks);

      getDecksCb(allDecks);

    }).error(function(data, status, headers, config) {
      console.log('getAllDecks error:', data, status, headers, config);
    });
  };

  var createDeck = function (postDeckObject, submitDeckCb) {
    $http.post('/api/decks', postDeckObject)
    .success(submitDeckCb);
  };


  return {
    getAllUserDecks: getAllUserDecks,
    getAllDecks: getAllDecks,
    createDeck: createDeck,
  };

});
