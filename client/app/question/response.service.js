'use strict';

angular.module('pitchPerfectApp')
.factory('ResponseFactory', function($http, $q) {

  var responseContext = {
    responseObj: null,
    questionObj: null,
    videoObj: null,
    videoUrl: null
  };

  var getResponseData = function(responseId, callback) {

    console.log('getResponseData called. responseId=' + responseId);

    // Promise array used for sequencing below
    var promises = [];
    var callbackData = {};
    var responseContext = this.responseContext;

    // Promise for response
    var responseObj = $http.get('/api/responses/' + responseId)
      .success(function(resp) {

        console.log('responseObj success resp=' + resp);

        // Add the response data to the Context Object
        responseContext.responseObj = resp;
        return resp;
      });

    //  Continue once the response comes back
    responseObj.then(function(data) {

      // //Promise for question
      // var questionObj = $http.get('/api/questions/' + data.data.questionId)
      //   .success(function(resp) {
      //     // Add the question data to the Context Object
      //     responseContext.questionObj = resp;
      //     callbackData.questionTitle = resp.title;
      //   });
      //
      // // Add to promise array
      // promises.push(questionObj);

      //Promise for video
      console.log('data.data.videoId=' + data.data.videoId);

      var videoUrl = $http.get('/api/videos/url/' + data.data.videoId)
        .success(function(resp) {

          console.log('videoUrl.success');

          console.log('resp.url=' + resp.url);

          // Add the video data to the Context Object
          responseContext.videoObj = resp;
          responseContext.videoUrl = resp.url;
          callbackData.videoUrl = resp.url;
        });

      // Add to promise array
      promises.push(videoUrl);

      // Execute in sequence
      $q.all(promises).then(function() {

        console.log('q.all called');
        //Update $scope via the passed in callback
        callback(callbackData.videoUrl);

      });

    });
  };

  // Expose the action to the controller
  return {
    responseContext: responseContext,
    getResponseData: getResponseData
  };
});
