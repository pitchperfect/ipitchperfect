'use strict';

angular.module('pitchPerfectApp')
  .controller('InterviewCtrl',
    function ($scope, $window, $interval, InterviewFactory, QuestionFactory, $state) {

    var processInterview = false;

    $scope.mediaStream = null;

    $scope.instructions = false;
    $scope.displayPreview = false;

    $scope.title = InterviewFactory.contextObject.title;
    $scope.description = InterviewFactory.contextObject.description;
    $scope.questions = InterviewFactory.contextObject.questionsStore;
    $scope.questionSelectedIndex = '';

    var toggleProcessInterviewStatus = function () {
      processInterview = !processInterview;
    };

    $scope.togglePreview = function() {
      $scope.displayPreview = !$scope.displayPreview;

      var btnPreview = $window.document.getElementById('btnShowPreview');

      if ($scope.displayPreview) {
        $scope.startPreviewVideo();
        btnPreview.innerHTML = 'Stop Preview';
      } else {
        $scope.stopCamera();
        btnPreview.innerHTML = 'Show Preview';
      }
    };

    $scope.hasResponses = function(question) {
      var questionId = question.fullQuestionObject._id;
      var responses = InterviewFactory.contextObject.responses[questionId];
      if ((responses) && (responses.length > 0)) {
        return true;
      }
      return false;
    };

    $scope.hasReviews = function(question) {
      var questionId = question.fullQuestionObject._id;
      var reviews = InterviewFactory.contextObject.reviews[questionId];
      if ((reviews) && (reviews.length > 0)) {
        return true;
      }
      return false;
    };

    $scope.getReviewStatus = function(question) {
      if ($scope.hasReviews(question)) {
        return 'View the reviews';
      }
      return 'No reviews';
    };

    $scope.getResponseStatus = function(question) {
      if ($scope.hasResponses(question)) {
        return 'View your responses';
      }
      return 'Not attempted';
    };

    $scope.getAllQuestions = function () {
      if ('questions' in InterviewFactory.contextObject) {
        for (var i = 0; i < InterviewFactory.contextObject.questions.length; i++) {
          InterviewFactory.getQuestion(i);
        }
      }
    };

    $scope.enableBeginInterview = function() {
      return ((InterviewFactory.contextObject !== undefined) &&
              (InterviewFactory.contextObject.questionsStore !== undefined) &&
              (InterviewFactory.contextObject.questionsStore.length > 0));
    };

    $scope.returnToInterview = function() {
      $scope.instructions = !$scope.instructions;
      toggleProcessInterviewStatus();
      //$state.go('interview');
    };

    $scope.goToReview = function(question) {
      if ($scope.hasReviews(question)) {
        var questionId = question.fullQuestionObject._id;
        var reviews = InterviewFactory.contextObject.reviews[questionId];
        var review = reviews[0];
        $state.go('reviewView', { reviewId : review._id });
      }
    };

    $scope.goToQuestion = function(question) {
      if (question) {
        // No op
      }

      $scope.stopCamera();
      $state.go('question');
    };

    $scope.goToResponse = function(question) {
      // goes to question page with selected response.
      if ($scope.hasResponses(question)) {
        // var questionId = question.fullContextObject._id;
        // var responses = InterviewFactory.contextObject.responses[questionId];
        // var response = responses[0];
        //$state.go('')
      }
    };

    $scope.showInstructions = function (question, index) {

      toggleProcessInterviewStatus();

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

    $scope.stopCamera = function() {
      // Stop the video streaming if it's running.
      if ($scope.mediaStream !== null) {
        var video = $window.document.getElementById('video-preview');
        video.pause();
        $scope.mediaStream.stop();
      }
    };

    $scope.returnHome = function() {
      $scope.stopCamera();
      $state.go('home');
    };

    $scope.getAllQuestions();
  });
