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

    $scope.getDecksCb = function (allDecks) {
      console.log('$scope decks:', allDecks);
      $scope.allDecks = allDecks;
    };

    $scope.getUserDecksCb = function (allUserDecks) {
      console.log('$scope userdecks:', allUserDecks);
      $scope.allUserDecks = allUserDecks;
      $scope.pruneDecks();
    };

    $scope.toggleSubmitBoxAppear = function () {
      $scope.submitBox = !$scope.submitBox;
    };

    $scope.createDeckCb = function () {
      $scope.newDeckDescription = '';
      $scope.newDeckTitle = '';
      $scope.qTitle1 = '';
      $scope.qTitle2 = '';
      $scope.toggleSubmitBoxAppear();
    };

    // NEED TO ADD CREATOR ID !!!
    $scope.submitNewDeck = function (newDeckTitle, newDeckDescription, Q1, Q2) {
      var postDeckObject = {
        title: newDeckTitle,
        description: newDeckDescription,
        questionsCollection: [Q1, Q2],
        active: true,
      };

      HomeFactory.createDeck(postDeckObject, $scope.createDeckCb, $scope.getDecksCb, $scope.getUserDecksCb);
    };


    InterviewFactory.getAllDecks($scope.getDecksCb, $scope.getUserDecksCb);
  });
