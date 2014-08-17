'use strict';

angular.module('pitchPerfectApp')
  .controller('HomeCtrl', function ($scope, HomeFactory, InterviewFactory, $state, socket, $http) {
    $scope.submitBox = false;
    $scope.allDecks = [];
    $scope.allUserDecks = [];
    $scope.allNotifications = [];

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


    //////
    // Grab the initial set of available comments
    $http.get('/api/notifications').success(function(notification) {
      console.log('GOT NOTIFS', notification);
      $scope.allNotifications = notification;

      // Update array with any new or deleted items pushed from the socket
      socket.syncUpdates('notification', $scope.notification, function(event, notification, notifications) {
        // This callback is fired after the comments array is updated by the socket listeners
        console.log('NOTIFS UPDATED', notification, notifications, event);
        // sort the array every time its modified
        notifications.sort(function(a, b) {
          a = new Date(a.date);
          b = new Date(b.date);
          return a>b ? -1 : a<b ? 1 : 0;
        });
      });
    });

    // Clean up listeners when the controller is destroyed
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('notification');
    });

    // // Use our rest api to post a new comment
    // $scope.addComment = function() {
    //   $http.post('/api/notifications', { content: $scope.newNotification });
    //   $scope.newNotification = '';
    // };
    //////







    $scope.reloadPageContent();
  });
