'use strict';

angular.module('pitchPerfectApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('reviewCreate', {
        url: '/reviewcreate',
        templateUrl: 'app/review/reviewCreate.html',
        controller: 'ReviewCtrlCreate'
      });
  });
