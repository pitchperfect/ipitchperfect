'use strict';

angular.module('pitchPerfectApp')
  .controller('HomeCtrl', function ($scope, $http, HomeFactory, $resource, InterviewFactory) {
    $scope.message = 'Hello';
    $scope.name = 'Friends';

    $scope.allDecks = [];
    $scope.questions = [];
    $scope.allUserDecks = [];



    /* 1) On page load - get all decks */
    $scope.getAllDecks = function () {
      $http.get('/api/decks').success(function(allDecks) {
        console.log('@home received decks', allDecks[0]);

        $scope.allDecks = allDecks;

        // [on deck click]   get the [single] question object associated
        $scope.getAllDeckQuestions(allDecks[0].questions[0]);
      });
    };


    /* 2) On page load -> get all UserDecks */
    $scope.getAllUserDecks = function () {
      $http.get('/api/userdecks').success(function(allUserDecks) {
        console.log('@home received userdecks', allUserDecks[0]);

        $scope.allUserDecks = allUserDecks;
        InterviewFactory.userDeck = allUserDecks[0];
        for (var key in allUserDecks[0].questionsResponded) {
          $scope.getAllResponses(allUserDecks[0].questionsResponded[key]);
        }

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
        InterviewFactory.questionObj = question;

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

    $scope.getAllUserDecks();

  });
