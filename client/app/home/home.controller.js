'use strict';

angular.module('pitchPerfectApp')
  .controller('HomeCtrl', function ($scope, $http, HomeFactory, $resource, InterviewFactory, $state) {
    $scope.submitBox = false;
    $scope.allDecks = [];
    $scope.allUserDecks = [];

    $scope.pruneDecks = function () {
      var userDecks = $scope.allUserDecks;
      var decks = $scope.allDecks;
      var matchCheckObj = {};

      for (var i = 0; i < decks.length; i++) {
        matchCheckObj[decks[i]._id] = decks[i];
      }

      for (var j = 0; j < userDecks.length; j++) {
        if (matchCheckObj[userDecks[j].deckId]) {
          matchCheckObj[userDecks[j].deckId] = null;
        }
      }
      $scope.allDecks = [];

      for (var k in matchCheckObj) {
        if (matchCheckObj[k]) {
          $scope.allDecks.push(matchCheckObj[k]);
        }
      }
    };

    $scope.sendToInterview = function (model, boolean) {
      console.log('model', model);
      InterviewFactory.contextObject = model;

      InterviewFactory.workingFromUserDeck = boolean;
      $state.go('interview');
    };


    /* 1) On page load - get all decks */
    $scope.getAllDecks = function () {
      $http.get('/api/decks').success(function(allDecks) {
        console.log('@home received decks', allDecks);

        $scope.allDecks = allDecks;
        $scope.getAllUserDecks();
      });
    };


    /* 2) On page load -> get all UserDecks */
    $scope.getAllUserDecks = function () {
      $http.get('/api/userdecks').success(function(allUserDecks) {
        console.log('@home received userdecks', allUserDecks);

        $scope.allUserDecks = allUserDecks;
        $scope.pruneDecks();
      });
    };


    $scope.toggleSubmitBoxAppear = function () {
      $scope.submitBox = !$scope.submitBox;
    };


    // NEED TO ADD CREATOR ID !!!
    $scope.submitNewDeck = function (newDeckTitle, newDeckDescription, Q1, Q2) {

      var postDeckObject = {
        title: newDeckTitle,
        description: newDeckDescription,
        questionsCollection: [Q1, Q2],
        active: true,
      };

      HomeFactory.createDeck(postDeckObject, $scope.getAllDecks);

      $scope.newDeckDescription = '';
      $scope.newDeckTitle = '';
      $scope.qTitle1 = '';
      $scope.qTitle2 = '';
      $scope.toggleSubmitBoxAppear();
    };



    $scope.getAllDecks();
  });
