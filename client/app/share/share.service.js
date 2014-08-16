'use strict';

angular.module('pitchPerfectApp')


.factory('ShareFactory', function($http) {

  var shareContext = {};


  var getAllUsers = function (callback) {
    $http.get('/api/users')
    .success(function(allUsers) {
      console.log(allUsers);
      callback(allUsers);
    }).error(function(data, status, headers, config) {
      console.log('getAllUsers error:', data, status, headers, config);
    });
  };


  var sendInvites = function(invites){

    // For Celine
    // invites contains the user names and emails for the invites
    // must be validated
    // Nedd to add user message to this object

    console.log('invites to be handled and validated on server', invites);
  };

  return {
    getAllUsers: getAllUsers,
    sendInvites: sendInvites,
    shareContext: shareContext
  };

});
