'use strict';

angular.module('pitchPerfectApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Welcome',
      'link': '/'
    }, {
      'title': 'Home',
      'link': '/home'
    },{'title': 'Interview',
      'link': '/interview'
    },{
      'title': 'Review Create',
      'link': '/reviewcreate'
    },{
      'title': 'Share',
      'link': '/share'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
