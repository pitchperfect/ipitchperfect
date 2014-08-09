'use strict';

angular.module('pitchPerfectApp')


.factory('HomeFactory', function($http) {


  // var createDeck = function (postDeckObject, callback) {
  //   $http.post('/api/decks', postDeckObject)
  //   .success(function() {
  //     callback();
  //   });
  // };
  //
  //
  // return {
  //   createDeck: createDeck,
  // };


  var getAllUserDecks = function (getUserDecksCb) {
    $http.get('/api/userdecks').success(function(allUserDecks) {
      console.log('@home received userdecks', allUserDecks);

      getUserDecksCb(allUserDecks);

    });
  };

  var getAllDecks = function (getDecksCb, getUserDecksCb) {
    $http.get('/api/decks').success(function(allDecks) {
      console.log('@home received decks', allDecks);

      getDecksCb(allDecks);
      this.getAllUserDecks(getUserDecksCb);
    });
  };
  // HomeFactory.createDeck(postDeckObject, $scope.createDeckCb, $scope.getDecksCb, $scope.getUserDecksCb);
  var createDeck = function (postDeckObject, createDeckCb, getDecksCb, getUserDecksCb) {
    $http.post('/api/decks', postDeckObject)
    .success(function() {
      postDeckObject();
      this.getAllDecks(getDecksCb, getUserDecksCb);
    });
  };


  return {
    createDeck: createDeck,
    getAllDecks: getAllDecks,
    getAllUserDecks: getAllUserDecks,
  };


});
