'use strict';

angular.module('pitchPerfectApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('interview', {
        url: '/interview',
        templateUrl: 'app/interview/interview.html',
        controller: 'InterviewCtrl'
      });
  });