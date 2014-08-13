'use strict';

angular.module('pitchPerfectApp')


.factory('QuestionFactory', function($upload) {

  var contextQuestion = {};

  var createVideo = function(blob){

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
        createResponse(data._id);
      }
    );
  };

  var createResponse = function(videoId){
  	console.log('Will use this id to create Response ', videoId);

    


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
