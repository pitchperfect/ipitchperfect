'use strict';

angular.module('pitchPerfectApp')

.factory('ReviewFactory', function($http, $q) {
  // Stores data returned from APIs

  var reviewContext = {};

  //testing
  //reviewContext.targetResponseId = '53efc88aec24afc92b95cc0f';

  var getResponseData = function(responseId, callback) {

    // Promise array used for sequencing below
    var promises = [];
    var theData = {};

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
          theData.questionTitle = resp.title;
        });

      // Add to promise array
      promises.push(questionObj);

      //Promise for video
      var videoUrl = $http.get('/api/videos/url/' + data.data.videoId)
        .success(function(resp) {
          // Add the video data to the Context Object
          reviewContext.videoObj = resp;
          theData.videoUrl = resp.url;
        });

      // Add to promise array
      promises.push(videoUrl);

      // Execute in sequence
      $q.all(promises).then(function() {
        //Update $scope via the passed in callback
        callback(theData.videoUrl, theData.questionTitle);

        console.log('review context from the factory ', reviewContext);
      });

    });
  };

  var saveReview = function(createReviewData) {
    // Create review data assembled on client
    $http.post('/api/reviews', createReviewData)
      .success(function(newReview) {

        // Assemble the data to be updated in the UserDeck
        var tempObj = {};
        tempObj.responseId = newReview.responseId;
        tempObj.reviewId = newReview._id;
        var userDeckId = newReview.userDeckId;

        // Update the UserDeck with the new review
        $http.put('/api/userdecks/' + userDeckId + '/review', tempObj)
          .success(function(updatedReview) {
            console.log('Review Updated!', updatedReview);
          });
      });
  };

  // Expose the action to the controller
  return {
    getResponseData: getResponseData,
    reviewContext: reviewContext,
    saveReview: saveReview
  };
});
