'use strict';

angular.module('pitchPerfectApp')


.factory('QuestionFactory', function() {

  var contextQuestion = {};

  return {
    contextQuestion: contextQuestion,
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
