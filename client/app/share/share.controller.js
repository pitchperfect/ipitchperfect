'use strict';

angular.module('pitchPerfectApp')

    .controller('ShareCtrl', function ($scope, $location, $state, ShareFactory, $http) {
    $scope.message = 'Hello';
    $scope.showNote = false;
    $scope.allUsers = [];
    $scope.usersSelected = [];

    // Callback function used to synch API data to the UI
    $scope.setAllUsers = function(allUsers){
      console.log(allUsers);
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
    	//ShareFactory.sendInvites(invites);
      $scope.addNotification();
    };

   	// Add the selected existing user to the invites list
	$scope.addToInvites = function(name, id) {
    $scope.usersSelected.push(id);

		if ($scope.invitees === undefined) {
			$scope.invitees = name;
		} else {
			$scope.invitees = $scope.invitees + ', ' + name;
		}
    $scope.addNotification();
	};
	// Provide space for a special message to the invitees
    $scope.toggleNote = function(){
    	$scope.showNote = !$scope.showNote;
    };
  //////

  // Use our rest api to post a new comment
  $scope.addNotification = function() {
    // need: userId = (originator // on server)
    // need: receiver = 'id of invited peer'
    $http.post('/api/reviews', { response: '12345', receiver: $scope.usersSelected[0], title: 'Hi there', description: 'Please review my video' });
    $scope.newNotification = '';
  };
  //////
  });
