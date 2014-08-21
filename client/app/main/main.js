'use strict';

angular.module('pitchPerfectApp')
  .config(function ($stateProvider) {
    $stateProvider

      .state('main', {
        // abstract: true,
        url: '',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'

        // views : {
        //   '': {
        //     templateUrl: 'app/main/main.html',
        //     controller: 'MainCtrl'
        //   },
        //   'addSignup@main': {
        //     templateUrl: 'app/account/signup/signup.html',
        //     controller: 'SignupCtrl'
        //   },
        //   'addLogin@main': {
        //     templateUrl: 'app/account/login/login.html',
        //     controller: 'LoginCtrl'
        //   }
        // }
      });
    // $urlRouterProvider.when('/', '/login');
  });
