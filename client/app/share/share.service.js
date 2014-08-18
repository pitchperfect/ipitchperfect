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


  var createReview = function(authorRequested) {
    // Assemble pertinent data for new Response Obj
    var tempObj = {
      responseId: shareContext.responseId,
      author: authorRequested,
      completed: false,
    };

    // Create response
    $http.post('/api/reviews', tempObj)
      .success(function(newReview) {
        // Push this reponse to the UserDeck
        console.log('review created', newReview);
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
    shareContext: shareContext,
    getAllUsers: getAllUsers,
    createReview: createReview,
    sendInvites: sendInvites,
  };

});
