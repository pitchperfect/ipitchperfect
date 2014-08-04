'use strict';

angular.module('pitchPerfectApp')
  .controller('ShareCtrl', function ($scope, $location, modalService) {
    $scope.message = 'Hello';
    $scope.showNote = false;
    $scope.toggleNote = function(){
    	$scope.showNote = !$scope.showNote;
    };

	var modalOptions = {
		//closeButtonText: 'Done',
		//actionButtonText: 'Done',
		headerText: 'You done shared...',
		bodyText: 'You\ve just shared your interview with Alan. Get ready to get some awesome feedback that will change your life'
	};

	$scope.showModal = function(){
	// modalService.showModal({}, modalOptions).then(function(/*result*/) {

	// 	$location.path('/home');
	// });
  
	$location.path('/home');

	};



  });
