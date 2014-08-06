'use strict';

angular.module('pitchPerfectApp')
  .controller('InterviewCtrl', function ($scope, $window, $interval) {
    $scope.message = 'Hello';

    $scope.startPrompt = false;
    $scope.startInterview = false;
    $scope.finishVideo = false;
    $scope.processInterview = false;
    $scope.reviewInterview = false;
    $scope.scriptingInterview = '';
    $scope.instructions = false;


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
      },1000,0);

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
      //debugger;
      $scope.processInterview = !$scope.processInterview;
    };

    $scope.synchReviewInterview = function () {
      $scope.reviewInterview = !$scope.reviewInterview;
    };

    $scope.changeItemStatus = function (item) {
      $scope[item] = !$scope[item];
    };


    $scope.startPreviewVideo = function() {
      var navigator = $window.navigator;

      var video = $window.document.getElementById('video-preview');
      // var downloadURL = document.getElementById('download-url');
      //
      // var startRecording = document.getElementById('start-recording');
      // var stopRecording = document.getElementById('stop-recording');


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
          video.controls = true;
          video.play();
            //callback(stream);
          },

          // Error callback
          function(error) {
            console.error(error);
          }
        );
      }
    };

    // Note that this causes the unit tests to fail.
    $scope.startPreviewVideo();

  });
