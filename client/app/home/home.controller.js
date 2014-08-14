'use strict';

angular.module('pitchPerfectApp')
  .controller('HomeCtrl', function ($scope, HomeFactory, InterviewFactory, $state) {
    $scope.submitBox = false;
    $scope.allDecks = [];
    $scope.allUserDecks = [];

    $scope.getUserDecksCb = function (allUserDecks) {
      $scope.allUserDecks = allUserDecks;
    };

    $scope.getDecksCb = function (decks) {
      $scope.allDecks = decks;
    };

    $scope.sendToInterview = function (model, isUserdeck) {
      console.log('model', model);
      model.questionsStore = [];
      InterviewFactory.contextObject = model;

      InterviewFactory.workingFromUserDeck = isUserdeck;

      $state.go('interview');
    };

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
    };


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
      //Auth.getCurrentUser;
    };

    $scope.reloadPageContent();

  });
