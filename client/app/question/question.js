'use strict';

angular.module('pitchPerfectApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('question', {
        url: '/question',
        templateUrl: 'app/question/question.html',
        controller: 'QuestionCtrl'
      })
      .state('questionView', {
        params:['responseId'],
        templateUrl: 'app/question/question.html',
        controller: 'QuestionCtrl'
      });
  });
