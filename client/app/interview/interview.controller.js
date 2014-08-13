'use strict';

angular.module('pitchPerfectApp')
  .controller('InterviewCtrl', function ($scope, $window, $interval, InterviewFactory, QuestionFactory, $state) {

    InterviewFactory.questionObj = [];

    $scope.startPrompt = false;
    $scope.startInterview = false;
    $scope.finishVideo = false;
    $scope.processInterview = false;
    $scope.reviewInterview = false;
    $scope.scriptingInterview = '';
    $scope.instructions = false;

    $scope.title = InterviewFactory.contextObject.title;
    $scope.description = InterviewFactory.contextObject.description;
    $scope.questions = InterviewFactory.questionObj;
    $scope.questionsForView = [];
    $scope.questionSelectedIndex = '';


    $scope.getQuestionResponseStatus = function getClass(id) {

      if ('questionsResponded' in InterviewFactory.contextObject) {
        if (InterviewFactory.contextObject.questionsResponded[id]) {
          return 'Attempted';
        }
      }
      return 'Not Attempted';
    };

    $scope.getQuestionReviewStatus = function getClass(id) {
      if ('responsesReviewed' in InterviewFactory.contextObject) {
        if (InterviewFactory.contextObject.responsesReviewed[id]) {
          return 'Peer Reviewed';
        }
      }
      return 'No Peer Reviews';

    };


    $scope.questionSelected = function () {
      $state.go('question');
    };

    $scope.startStopWatch = function () {
      $scope.sec = 0;
      $scope.min = 0;
      $interval(function(){
        if ($scope.sec === 59) {
          $scope.sec = 0;
          $scope.min = $scope.min + 1;
          return;
        }
        $scope.sec++;
        if ($scope.sec < 10) {
          $scope.sec = '0'+ $scope.sec;
        }
      }, 1000, 0);
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

    $scope.changePromptStatus = function () {
      $scope.startPrompt = !$scope.startPrompt;
    };

    $scope.changeFinishVideoStatus = function () {
      $scope.finishVideo = !$scope.finishVideo;
    };

    $scope.changeInterviewStatus = function () {
      // $scope.scriptingInterview = '';
      $scope.instructions = false;
      $scope.startInterview = !$scope.startInterview;
      if ($scope.startInterview) {
        $scope.startStopWatch();
      }
    };

    $scope.changeProcessInterviewStatus = function () {
      $scope.processInterview = !$scope.processInterview;
    };

    $scope.synchReviewInterview = function () {
      $scope.reviewInterview = !$scope.reviewInterview;
    };

    $scope.changeItemStatus = function (item) {
      $scope[item] = !$scope[item];
    };


    $scope.getPreviousResponse = function () {
      var response = InterviewFactory.retrieveResponse();
      console.log(response);
    };


    // 1) get questions.
    $scope.getAllDeckQuestions = function () {
      if ('questions' in InterviewFactory.contextObject) {
        for (var i = 0; i < InterviewFactory.contextObject.questions.length; i++) {
          InterviewFactory.getQuestion(InterviewFactory.contextObject.questions[i], i, $scope.getQuestionResponseStatus, $scope.getQuestionReviewStatus);
        }
      }
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
    // Go ahead and start the preview video.
    $scope.startPreviewVideo();
    $scope.getAllDeckQuestions();
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
