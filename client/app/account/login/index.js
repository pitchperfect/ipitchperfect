'use strict';

angular.module('pitchPerfectApp')
  .config(function ($stateProvider) {
    $stateProvider.state('main.login', {
      // abstract: true,
      url: '/login',
      templateUrl: 'app/account/login/login.html',
      controller: 'LoginCtrl'
    });
  });
