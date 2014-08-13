'use strict';

angular.module('pitchPerfectApp')

    .controller('ShareCtrl', function ($scope, $location, $state, ShareFactory) {
    $scope.message = 'Hello';
    $scope.showNote = false;
    $scope.allUsers = [];

    // Callback function used to synch API data to the UI
    $scope.setAllUsers = function(allUsers){
    	$scope.allUsers = allUsers;
    };

    // Populate the user dropdown list with active users
    ShareFactory.getAllUsers($scope.setAllUsers);

    // Called on close of sharing modal confirmation
	$scope.gotoHome = function() {
		$('#myModal').modal('hide');
		// This is a kludge to allows time for the modal fadeout
		var goHome = function() {
			$state.go('home');
		};
		// Route to /home
		setTimeout(goHome, 500);
	};

	// Pre-process names and emails, then send to API
    $scope.processInvites = function(){
    	// Show the modal
    	$('#myModal').modal('show');
    	// Parse out invitees
    	var invitees = $scope.invitees.split(',');
    	var invites = {};
    	invites.names = [];
    	invites.emails = [];
    	var invitee;

    	for (var i = 0; i < invitees.length; i++ ){
    		invitee = invitees[i].trim();
    		if (invitee.indexOf('@') !== -1){
    			invites.emails.push(invitee);
    		} else {
    			invites.names.push(invitee);
    		}
    	}
    	// Send the invitees object to the API
    	ShareFactory.sendInvites(invites);
    };

   	// Add the selected existing user to the invites list
	$scope.addToInvites = function(name) {

		if ($scope.invitees === undefined) {
			$scope.invitees = name;
		} else {
			$scope.invitees = $scope.invitees + ', ' + name;
		}
	};
	// Provide space for a special message to the invitees
    $scope.toggleNote = function(){
    	$scope.showNote = !$scope.showNote;
    };

  });
