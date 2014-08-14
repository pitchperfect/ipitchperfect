'use strict';

angular.module('pitchPerfectApp')


.factory('QuestionFactory', function($upload, $http) {

  var testUserId = '53ebaffbaadbfc981701ed66';

  var contextQuestion = {};

  var createVideo = function(blob, questionObj){

  	$upload.upload({
      url: '/api/videos',
      data: {key: 'value'},
      file: blob,
    }).progress(
      function(evt) {
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }
    ).success(
      function(data) {
        createResponse(data._id, questionObj);
      }
    );
  };

  var createResponse = function(videoId, questionObj){

    var tempObj ={};
    tempObj.userId = testUserId;
    tempObj.questionId = questionObj.fullQuestionObject._id;
    tempObj.title = questionObj.fullQuestionObject.title;
    tempObj.videoId = videoId;
    tempObj.deckId = questionObj.currentUserDeckId;

    $http.post('/api/responses', tempObj)
    .success(function(newResponse) {

      updateUserDeckWithResponse(tempObj.deckId, tempObj.questionId, newResponse._id );

    });
  
  };

  var updateUserDeckWithResponse = function(deckId, questionId, responseId) {

      var tempObj = {};
      tempObj.questionId = questionId;
      tempObj.responseId = responseId;


      $http.put('/api/userdecks/' + deckId, tempObj)
        .success(function(updatedQuestion) {
          console.log('Question Updated!', updatedQuestion);

        });
  };

  return {
    contextQuestion: contextQuestion,
    createVideo: createVideo
  };
});

// Submit video.
// $scope.submitVideo = function (videoId) {
//   // Actually want all questions from deck id.
//
//   var postObject = {
//     userId: InterviewFactory.questionObj.userId,
//     video: videoId,
//     deck: InterviewFactory.questionObj.deck,
//     userDeck: InterviewFactory.userDeck._id,
//     question: InterviewFactory.questionObj._id,
//     questionTitle: InterviewFactory.questionObj.title,
//     description: '1min 30sec long',
//     textVideo: 'new text video',
//     active: true,
//   };
//   console.log('postObject', postObject);
//
//   $http.post('/api/responses', postObject).success(function(createdResponse) {
//       console.log('@interview, response created', createdResponse);
//
//   }).error(function(err) {
//     console.log('error creating response', err);
//   }); //.bind(this));
// };
