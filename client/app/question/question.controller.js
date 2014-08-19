'use strict';

angular.module('pitchPerfectApp')
  .controller('QuestionCtrl',
    function ($scope, $window, $timeout, $interval, $upload, QuestionFactory, $state, InterviewFactory) {

  $scope.mediaStream = null;
  $scope.audioVideoRecorder = null;
  var videoElement = $window.document.getElementById('video-record');
  var questionObj = QuestionFactory.contextQuestion;
  $scope.alertUser = '';

  $scope.btnDisabled = {};

  $scope.getQuestion = function () {
    //console.log('testing contextQuestion Obj:', QuestionFactory.contextQuestion);
    var contextQuestion = QuestionFactory.contextQuestion;
    if ('fullQuestionObject' in contextQuestion) {
      $scope.question = QuestionFactory.contextQuestion.fullQuestionObject.title;
    }
  };

  $scope.startCountDown = function (time, message) {
    if (time > 1) {
      time--;
      $scope.alertUser = time;
      $timeout(function(){
          $scope.startCountDown(time, message);
      }, 750);
    } else {
      $scope.alertUser = message;
      $scope.startStopWatch();

      var btnStopRecording  = $window.document.getElementById('btn-stop-recording');
      btnStopRecording.disabled = false;
      $scope.startRecording();
    }
  };

  $scope.startStopWatch = function () {
    $scope.sec = 0;
    $scope.min = 0;
    $interval(function(){
      if ($scope.sec === 59) {
        $scope.sec = 0;
        $scope.min = $scope.min + 1;
        $scope.alertUser = $scope.min + 'min, wrap up your answer!';
        return;
      }
      $scope.sec++;
      if ($scope.sec < 10) {
        $scope.sec = '0'+ $scope.sec;
      }
    }, 1000, 0);
  };

  $scope.startCountDown(4, 'Smile, you are being recorded');

  $scope.changeProcessInterviewStatus = function () {
    $scope.processInterview = !$scope.processInterview;

    if(!$scope.processInterview) {
      $scope.startCountDown(4, 'Smile, you are being recorded');
    }
  };

  $scope.captureUserMedia = function(successCallback) {
    console.log('captureUserMedia called.');

    $window.navigator.getUserMedia = navigator.getUserMedia ||
                                     navigator.mozGetUserMedia ||
                                     navigator.webkitGetUserMedia;

    $window.navigator.getUserMedia(
      // Configuration
      {
        audio: true,
        video: true
      },

      successCallback,

      // Error callback
      function(error) {
        console.log(JSON.stringify(error));
      }
    );
  };

  $scope.startRecording = function() {

    // var downloadURL = $window.document.getElementById('download-url');

    $scope.btnDisabled.start = true;
    $scope.btnDisabled.stop = false;
    $scope.btnDisabled.exit = true;
    $scope.btnDisabled.save = true;
    $scope.btnDisabled.replay = true;
    
    videoElement.style.visibility = 'visible';
    // downloadURL.innerHTML = 'Smile, you are being recorded';

    $scope.captureUserMedia(
      function(stream) {
        $scope.mediaStream = stream;

        // need videoElement variable decl
        videoElement.src = $window.URL.createObjectURL(stream);
        videoElement.muted = true;
        videoElement.controls = false;
        videoElement.play();

        $scope.audioVideoRecorder = $window.RecordRTC(stream, {type: 'video'});
        $scope.audioVideoRecorder.startRecording();
      }
    );
  };

  $scope.replayRecording = function() {
    videoElement.play();
  };

  $scope.exitRecording = function() {
    InterviewFactory.workingFromUserDeck = true;
    $scope.stopCamera();
    $state.go('interview');
  };

  $scope.stopCamera = function(forceStopRtc) {
    forceStopRtc = forceStopRtc || false;

    if ($scope.mediaStream !== null) {
      var video = $window.document.getElementById('video-record');
      if (video !== null) {
        video.pause();
      }
      $scope.mediaStream.stop();
    }

    if ((forceStopRtc) && ($scope.audioVideoRecorder !== null)) {
      $scope.audioVideoRecorder.stopRecording(function() {
        console.log('stopping audioVideoRecorder');
      });
    }
  };

  $scope.saveRecording = function() {
    // Grab blob created by recording
    var videoBlob = $scope.audioVideoRecorder.getBlob();
    // Create response based on this blob
    QuestionFactory.createVideo(videoBlob, questionObj, $scope.stopCamera);

    //$state.go('interview');
  };

  $scope.stopRecording = function() {
    console.log('stopRecording called.');
    $scope.processInterview = !$scope.processInterview;

    //var downloadURL = $window.document.getElementById('download-url');

    $scope.btnDisabled.start = false;
    $scope.btnDisabled.stop = true;
    $scope.btnDisabled.exit = false;
    $scope.btnDisabled.save = false;
    $scope.btnDisabled.replay = false;

    //btnReplayRecording.style.visibility = 'visible';
    videoElement.style.visibility = 'visible';

    $scope.audioVideoRecorder.stopRecording(
      function(url) {
        console.log('stop recording fired with ', url);
        videoElement.src = url;
        videoElement.muted = false;
        videoElement.onended = function() {
          console.log('video element on');

          $scope.stopCamera();

          videoElement.src = $window.URL.createObjectURL($scope.audioVideoRecorder.getBlob());
        };
      }
    );
  };

  $scope.getQuestion();
});
