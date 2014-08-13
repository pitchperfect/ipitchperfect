'use strict';

angular.module('pitchPerfectApp')
  .controller('InterviewCtrl', function ($scope, $window, $interval, InterviewFactory, QuestionFactory, $state) {
    //InterviewFactory.questionObj = [];
    $scope.processInterview = false;
    $scope.instructions = false;

    $scope.title = InterviewFactory.contextObject.title;
    $scope.description = InterviewFactory.contextObject.description;
    $scope.questions = InterviewFactory.questionObj;
    $scope.questionSelectedIndex = '';

    $scope.changeProcessInterviewStatus = function () {
      $scope.processInterview = !$scope.processInterview;
    };


    // 1) get questions.
    $scope.getAllQuestions = function () {
      if ('questions' in InterviewFactory.contextObject) {
        for (var i = 0; i < InterviewFactory.contextObject.questions.length; i++) {
          InterviewFactory.getQuestion(i, $scope.getQuestionResponseStatus, $scope.getQuestionReviewStatus); // InterviewFactory.contextObject.questions[i],
        }
      }
    };


    $scope.getQuestionResponseStatus = function (id) {
      if ('questionsResponded' in InterviewFactory.contextObject) {
        if (InterviewFactory.contextObject.questionsResponded[id]) {
          return 'Attempted';
        }
      }
      return 'Not Attempted';
    };

    $scope.getQuestionReviewStatus = function (id) {
      if ('responsesReviewed' in InterviewFactory.contextObject) {
        if (InterviewFactory.contextObject.responsesReviewed[id]) {
          return 'Peer Reviewed';
        }
      }
      return 'No Peer Reviews';
    };


    $scope.showInstructions = function (question, index) {
      question = question || InterviewFactory.questionObj[0];
      console.log('question selected', question);
      index = index || 0;

      QuestionFactory.contextQuestion = question;
      $scope.questionSelectedIndex = index +1;
      $scope.instructions = !$scope.instructions;

      if (!InterviewFactory.workingFromUserDeck) {
        InterviewFactory.createAUserDeck();
      }
    };



    $scope.questionSelected = function () {
      $state.go('question');
    };



    $scope.startPreviewVideo = function() {
      var navigator = $window.navigator;
      if ((navigator !== undefined) && (navigator !== null)) {
        var video = $window.document.getElementById('video-preview');

        navigator.getUserMedia = navigator.getUserMedia ||
                                 navigator.webkitGetUserMedia ||
                                 navigator.mozGetUserMedia ||
                                 navigator.msGetUserMedia;

        if (navigator.getUserMedia !== undefined) {
          navigator.getUserMedia (
            // Constraints
            {
              audio: true,
              video: true
            },

            // Success callback
            function(stream) {
              video.src = URL.createObjectURL(stream);
              video.muted = true;
              video.controls = false;
              video.play();
              //callback(stream);
            },

            // Error callback
            function(error) {
              console.error(error);
            }
          );
        }
      }
    };


    $scope.startPreviewVideo();
    $scope.getAllQuestions();
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
