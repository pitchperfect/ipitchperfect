'use strict';

angular.module('pitchPerfectApp')


.factory('QuestionFactory', function($upload, $http) {

  var contextQuestion = {};

  var createVideo = function(blob, questionObj, successCallback) {
    // Use $upload to handle multipart/form post processing with the video file
    $upload.upload({
      url: '/api/videos',
      data: {
        key: 'value'
      },
      file: blob,
    }).progress(
      function(evt) {
        // Upload progess.  Can be harnessed later in the UI
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }
    ).success(
      function(data) {
        // Video Obj successfully created in DB.
        // Now create Response Obj with above video
        createResponse(data._id, questionObj);
        successCallback();
      }
    );
  };

  var createResponse = function(videoId, questionObj) {
    // Assemble pertinent data for new Response Obj
    var tempObj = {};
    tempObj.questionId = questionObj.fullQuestionObject._id;
    tempObj.title = questionObj.fullQuestionObject.title;
    tempObj.videoId = videoId;
    tempObj.userDeckId = questionObj.currentUserDeckId;

    // Create response
    $http.post('/api/responses', tempObj)
      .success(function(newResponse) {
        // Push this reponse to the UserDeck
        updateUserDeckWithResponse(tempObj.userDeckId, tempObj.questionId, newResponse._id);
      });
  };

  var updateUserDeckWithResponse = function(deckId, questionId, responseId) {
    // Assemble all pertinent data for the update
    var tempObj = {};
    tempObj.questionId = questionId;
    tempObj.responseId = responseId;

    // Push the response to the UserDeck
    $http.put('/api/userdecks/' + deckId + '/response', tempObj)
      .success(function(updatedResponse) {
        console.log('Response Updated!', updatedResponse);
      });
  };

  // Expose the action to the controller
  return {
    contextQuestion: contextQuestion,
    createVideo: createVideo
  };
});
