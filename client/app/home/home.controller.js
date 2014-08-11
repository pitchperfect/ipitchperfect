'use strict';

angular.module('pitchPerfectApp')
  .controller('HomeCtrl', function ($scope, HomeFactory, InterviewFactory, $state) {
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


    $scope.getDecksCb = function (allDecks) {debugger;
      console.log('$scope decks:', allDecks);
      $scope.allDecks = allDecks;
    };

    $scope.getUserDecksCb = function (allUserDecks) {debugger;
      console.log('$scope userdecks:', allUserDecks);
      $scope.allUserDecks = allUserDecks;
      $scope.pruneDecks();
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
      var createnewDeck = HomeFactory.createDeck(postDeckObject);
      createnewDeck.success(function() {
        $scope.reloadPageContent();
      });

      $scope.newDeckDescription = '';
      $scope.newDeckTitle = '';
      $scope.qTitle1 = '';
      $scope.qTitle2 = '';
      $scope.toggleSubmitBoxAppear();
    };

    $scope.reloadPageContent = function () {debugger;
      HomeFactory.getAllDecks($scope.getDecksCb, $scope.getUserDecksCb);
    };

    $scope.reloadPageContent();

  });
