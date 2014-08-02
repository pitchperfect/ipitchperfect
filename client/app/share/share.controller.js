'use strict';

angular.module('pitchPerfectApp')
  .controller('ShareCtrl', function ($scope) {
    $scope.message = 'Hello';
    $scope.showNote = false;
    $scope.toggleNote = function(){
    	$scope.showNote = !$scope.showNote;
    };

  });
