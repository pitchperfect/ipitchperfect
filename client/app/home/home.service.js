'use strict';

angular.module('pitchPerfectApp')


.factory('HomeFactory', function($http) {

  var getAllUserDecks = function (getUserDecksCb) {
    debugger;
    $http.get('/api/userdecks').success(function(allUserDecks) {debugger;
      console.log('@home received userdecks', allUserDecks);
      getUserDecksCb(allUserDecks);
    })
    .error(function(data, status, headers, config) {
      console.log('getAllUserDecks error:', data, status, headers, config);
    });
  };


  var getAllDecks = function (getDecksCb, getUserDecksCb) {
    var getAllUserDecksReference = this.getAllUserDecks;
    debugger;
    $http.get('/api/decks')
    .success(function(allDecks) {debugger;
      console.log('@home received decks', allDecks);
      getDecksCb(allDecks);
      getAllUserDecksReference(getUserDecksCb);
    }).error(function(data, status, headers, config) {
      console.log('getAllDecks error:', data, status, headers, config);
    });
  };

  var createDeck = function (postDeckObject) {
    return $http.post('/api/decks', postDeckObject);
  };


  return {
    getAllUserDecks: getAllUserDecks,
    getAllDecks: getAllDecks,
    createDeck: createDeck,
  };

});
