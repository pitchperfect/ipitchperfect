'use strict';

angular.module('pitchPerfectApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('reviewCreate', {
        url: '/reviewcreate',
        templateUrl: 'app/review/reviewcreate.html',
        controller: 'ReviewCtrlCreate'
      });
  });
