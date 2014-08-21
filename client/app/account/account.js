'use strict';

angular.module('pitchPerfectApp')
.config(function ($stateProvider) {
  $stateProvider
    .state('settings', {
      url: '/settings',
      templateUrl: 'app/account/settings/settings.html',
      controller: 'SettingsCtrl',
      authenticate: true
    });
  });
