'use strict';

angular.module('pitchPerfectApp')
  .controller('HomeCtrl', function ($scope, HomeFactory, InterviewFactory, $state) {
    $scope.submitBox = false;
    $scope.allDecks = [];
    $scope.allUserDecks = [];

    $scope.getUserDecksCb = function (allUserDecks) {
      console.log('$scope userdecks:', allUserDecks);

      $scope.allUserDecks = allUserDecks;
    };

    $scope.getDecksCb = function (decks) {
      var userDecks = $scope.allUserDecks;
      // var decks = allDecks;
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


    // $scope.getDecksCb = function (allDecks) {
    //   console.log('$scope decks:', allDecks);
    //   //$scope.allDecks = allDecks;
    //   $scope.pruneDecks(allDecks);
    // };


    $scope.toggleSubmitBoxAppear = function () {
      $scope.submitBox = !$scope.submitBox;
    };

    $scope.submitDeckCb = function () {
      $scope.newDeckDescription = '';
      $scope.newDeckTitle = '';
      $scope.qTitle1 = '';
      $scope.qTitle2 = '';
      $scope.toggleSubmitBoxAppear();

      $scope.reloadPageContent();
    }


    // NEED TO ADD CREATOR ID !!!
    $scope.submitNewDeck = function (newDeckTitle, newDeckDescription) {

      var postDeckObject = {
        title: newDeckTitle,
        description: newDeckDescription,
        questionsCollection: [],
        active: true,
      };

      var questions = Array.prototype.slice.call(arguments, 2);
      questions.forEach(function(q) {
        if (q) {
          postDeckObject.questionsCollection.push(q);
        }
      });

      HomeFactory.createDeck(postDeckObject, $scope.submitDeckCb);
    };

    $scope.reloadPageContent = function () {
      HomeFactory.getAllUserDecks($scope.getDecksCb, $scope.getUserDecksCb);
    };

    $scope.reloadPageContent();

  });
