'use strict';

angular.module('pitchPerfectApp')
  .controller('InterviewCtrl',
    function ($scope, $window, $interval, InterviewFactory, QuestionFactory, $state) {

    $scope.mediaStream = null;

    $scope.processInterview = false;
    $scope.instructions = false;

    $scope.title = InterviewFactory.contextObject.title;
    $scope.description = InterviewFactory.contextObject.description;
    $scope.questions = InterviewFactory.contextObject.questionsStore;
    $scope.questionSelectedIndex = '';

    $scope.changeProcessInterviewStatus = function () {
      $scope.processInterview = !$scope.processInterview;
    };


    $scope.getAllQuestions = function () {
      if ('questions' in InterviewFactory.contextObject) {
        for (var i = 0; i < InterviewFactory.contextObject.questions.length; i++) {
          InterviewFactory.getQuestion(i,
                                       $scope.getQuestionResponseStatus,
                                       $scope.getQuestionReviewStatus);
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
      question = question || InterviewFactory.contextObject.questionsStore[0];
      index = index || 0;

      QuestionFactory.contextQuestion = question;


      // Add the userDeckId to the question object for existing user decks
      if (InterviewFactory.workingFromUserDeck){
        QuestionFactory.contextQuestion.currentUserDeckId = InterviewFactory.contextObject._id;
      }




      $scope.questionSelectedIndex = index +1;
      $scope.instructions = !$scope.instructions;

      if (!InterviewFactory.workingFromUserDeck) {
        InterviewFactory.createAUserDeck(function(id){
          // Add the userDeckId to the question object when new deck is created
          QuestionFactory.contextQuestion.currentUserDeckId = id;
        });
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
              $scope.mediaStream = stream;
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

    $scope.returnHome = function() {
      // Stop the video streaming if it's running.
      if ($scope.mediaStream !== null) {
        var video = $window.document.getElementById('video-preview');
        video.pause();
        $scope.mediaStream.stop();
      }
      $state.go('home');
    };

    $scope.questionSelected = function () {
      $state.go('question');
    };

    $scope.startPreviewVideo();
    $scope.getAllQuestions();
  });
