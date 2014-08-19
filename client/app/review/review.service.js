'use strict';

angular.module('pitchPerfectApp')

.factory('ReviewFactory', function($http, $q) {
  // Stores data returned from APIs

  return { //open return

    reviewContext: {},

    getReviewData: function(reviewId, callback) {

      var reviewContext = this.reviewContext;
      var callbackData = {};
      var promises = [];

      var reviewObj = $http.get('/api/reviews/' + reviewId)
        .success(function(review) {
          // Add the response data to the Context Object
          reviewContext.reviewObj = review;
          callbackData.annotations = review.annotations;
          return review;
        });

      reviewObj.then(function(review) {
        review = review.data;

        var questionObj = $http.get('/api/questions/' + review.questionId)
          .success(function(question) {
            // Add the question data to the Context Object
            reviewContext.questionObj = question;
            callbackData.questionTitle = question.title;
          });

        promises.push(questionObj);

        var videoUrl = $http.get('/api/videos/url/' + review.videoId)
          .success(function(video) {
            // Add the video data to the Context Object
            reviewContext.videoObj = video;
            callbackData.videoUrl = video.url;
          });

        // Add to promise array
        promises.push(videoUrl);

        var userName = $http.get('/api/users/' + review.userId)
          .success(function(user) {
            // Add the video data to the Context Object
            reviewContext.userObj = user;
            callbackData.responderName = user.name;
          });

        promises.push(userName);

        // Execute in sequence
        $q.all(promises).then(function() {
          //Update $scope via the passed in callback
          callback(callbackData);
        });

      });

    },

    getResponseData: function(responseId, callback) {

      // Promise array used for sequencing below
      var promises = [];
      var callbackData = {};
      var reviewContext = this.reviewContext;

      // Promise for response
      var responseObj = $http.get('/api/responses/' + responseId)
        .success(function(resp) {
          // Add the response data to the Context Object
          reviewContext.responseObj = resp;
          return resp;
        });

      //  Continue once the response comes back
      responseObj.then(function(data) {

        //Promise for question
        var questionObj = $http.get('/api/questions/' + data.data.questionId)
          .success(function(resp) {
            // Add the question data to the Context Object
            reviewContext.questionObj = resp;
            callbackData.questionTitle = resp.title;
          });

        // Add to promise array
        promises.push(questionObj);

        //Promise for video
        var videoUrl = $http.get('/api/videos/url/' + data.data.videoId)
          .success(function(resp) {
            // Add the video data to the Context Object
            reviewContext.videoObj = resp;
            callbackData.videoUrl = resp.url;
          });

        // Add to promise array
        promises.push(videoUrl);

        // Execute in sequence
        $q.all(promises).then(function() {
          //Update $scope via the passed in callback
          callback(callbackData.videoUrl, callbackData.questionTitle);

        });

      });
    },

    saveReview: function(createReviewData) {
      // Create review data assembled on client

      $http.put('/api/reviews' + '/' + createReviewData._id, createReviewData)
        .success(function(updatedReview) {

          // Assemble the data to be updated in the UserDeck
          var paramsToUpdate = {};
          paramsToUpdate.responseId = updatedReview.responseId;
          paramsToUpdate.reviewId = updatedReview._id;
          var userDeckId = updatedReview.userDeckId;

          // Update the UserDeck with the new review
          $http.put('/api/userdecks/' + userDeckId + '/review', paramsToUpdate)
            .success(function() {
              //will pass back userDeck model into function above if needed
            });
        });
    }

  }; //close return object

});
