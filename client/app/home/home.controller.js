'use strict';

angular.module('pitchPerfectApp')
  .controller('HomeCtrl', function ($scope, HomeFactory, InterviewFactory, ReviewFactory, $state, socket) {
    $scope.submitBox = false;
    $scope.allDecks = [];
    $scope.allUserDecks = [];
    $scope.reviews = [];

    $scope.getUserDecksCb = function (allUserDecks) {
      $scope.allUserDecks = allUserDecks;
    };

    $scope.getDecksCb = function (decks) {
      decks.sort(function (alpha, beta){
        var a = alpha.title;
        var b = beta.title;
        return a>b ? 1 : a<b ? -1 : 0;
      });
      $scope.allDecks = decks;
      socket.syncUpdates('deck', $scope.allDecks, function(event, deck, decks) {
        console.log('modified deck collection', deck);
        // This callback is fired after the comments array is updated by the socket listeners
        // sort the array every time its modified
        decks.sort(function(alpha, beta) {
          var a = alpha.title;
          var b = beta.title;
          return a>b ? 1 : a<b ? -1 : 0;
        });
      });
    };

    $scope.setReviewRequests = function (reviewsOnLoad) {
      $scope.reviews = reviewsOnLoad;

      // Update array with any new or deleted items pushed from the socket
      socket.syncUpdates('review', $scope.reviews, function(event, review, reviews) {
        // This callback is fired after the comments array is updated by the socket listeners
        // sort the array every time its modified
        reviews.sort(function(a, b) {
          //a = new Date(a.created_at); //*********
          //b = new Date(b.created_at); //*********
          return a>b ? -1 : a<b ? 1 : 0;
        });
      });
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('request');
    });

    $scope.sendToInterview = function (model, isUserdeck) {
      console.log('model', model);
      model.questionsStore = [];
      InterviewFactory.contextObject = model;

      InterviewFactory.workingFromUserDeck = isUserdeck;

      $state.go('interview');
    };

    $scope.sendToReview = function (model) {
      console.log('model', model);
      model.questionsStore = [];
      ReviewFactory.reviewContext = model;
      ReviewFactory.reviewContext.targetResponseId = model.responseId;
      $state.go('reviewCreate');
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
      HomeFactory.getRequests($scope.setReviewRequests);
    };

    $scope.reloadPageContent();
  });
