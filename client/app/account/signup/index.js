'use strict';

angular.module('pitchPerfectApp')
  .config(function ($stateProvider) {
    $stateProvider

      .state('main.signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      });
    });
