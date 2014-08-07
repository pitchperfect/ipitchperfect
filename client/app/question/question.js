'use strict';

angular.module('pitchPerfectApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('question', {
        url: '/question',
        templateUrl: 'app/question/question.html',
        controller: 'QuestionCtrl'
      });
  });