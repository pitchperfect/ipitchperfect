'use strict';

angular.module('pitchPerfectApp')
  .controller('HomeCtrl', function ($scope, $http, HomeFactory, $resource, InterviewFactory, $state) {
    $scope.message = 'Hello';
    $scope.name = 'Friends';

    $scope.allDecks = [];
    $scope.questions = [];
    $scope.allUserDecks = [];

    $scope.pruneDecks = function () {
      var userDecks = $scope.allUserDecks;
      var Decks = $scope.allDecks;
      for (var i = 0; i < userDecks.length; i++) {
        for (var j = 0; j < Decks.length; j++) {
          if (userDecks[i].deckId === Decks[j]._id) {
            Decks.splice(j, 1);
          }
        }
      }
    };

    $scope.sendToInterview = function (model) {
      console.log('model', model);
      InterviewFactory.contextObject = model;
      $state.go('interview');
    };


    /* 1) On page load - get all decks */
    $scope.getAllDecks = function () {
      $http.get('/api/decks').success(function(allDecks) {
        console.log('@home received decks', allDecks);

        $scope.allDecks = allDecks;
        $scope.getAllUserDecks();

        // [on deck click]   get the [single] question object associated
        // ******* $scope.getAllDeckQuestions(allDecks[0].questions[0]);
      });
    };


    /* 2) On page load -> get all UserDecks */
    $scope.getAllUserDecks = function () {
      $http.get('/api/userdecks').success(function(allUserDecks) {
        console.log('@home received userdecks', allUserDecks);

        $scope.allUserDecks = allUserDecks;
        $scope.pruneDecks();
        //**********
        // InterviewFactory.userDeck = allUserDecks[0];
        // for (var key in allUserDecks[0].questionsResponded) {
        //   $scope.getAllResponses(allUserDecks[0].questionsResponded[key]);
        // }

      });
    };


    /* 3) [On deck click] get all [single here] Questions for that deck */
    $scope.getAllDeckQuestions = function (questionId) {
      var getQuestions = $resource('/api/questions/:id/', {
        id: '@_id'
      },
      {
        get: {
          method: 'GET',
          params: {
            id: questionId
          }
        }
      });

      getQuestions.get({}, function(question) {
        console.log('question received @home', question);
        //InterviewFactory.questionObj = question;

      }, function(err) {
        console.log('question err:', err);
      }); //.$promise; ???
    };





    /* 4) Per UserDeck, get all Responses for that deck, if no response get question obj*/
    $scope.getAllResponses = function (responseId) {
      var getResponses = $resource('/api/responses/:id/', {
        id: '@_id'
      },
      {
        get: {
          method: 'GET',
          params: {
            id: responseId
          }
        }
      });

      getResponses.get({}, function(response) {
        console.log('response received @home', response);
      }, function(err) {
        console.log('question err:', err);
      });
    };










    $scope.getAllDecks();
  });
