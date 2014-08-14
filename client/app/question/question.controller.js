'use strict';

angular.module('pitchPerfectApp')
  .controller('QuestionCtrl',
    function ($scope, $window, $timeout, $interval, $upload, QuestionFactory, $state, InterviewFactory) {

  $scope.mediaStream = null;
  $scope.audioVideoRecorder = null;
  var videoElement = $window.document.getElementById('video-record');
  var questionObj = QuestionFactory.contextQuestion;
  $scope.alertUser = '';



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
      }, 1000);
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
    var btnStartRecording = $window.document.getElementById('btn-start-recording');
    var btnStopRecording  = $window.document.getElementById('btn-stop-recording');

    var btnReplayRecording = $window.document.getElementById('btn-replay-recording');
    var btnExitRecording = $window.document.getElementById('btn-exit-recording');
    var btnSaveRecording = $window.document.getElementById('btn-save-recording');

    // var downloadURL = $window.document.getElementById('download-url');

    btnStartRecording.disabled = true;
    btnStopRecording.disabled = false;
    btnExitRecording.disabled = true;
    btnSaveRecording.disabled = true;
    btnReplayRecording.disabled = true;
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
    // $window.alert('redirect to UserDeck');
    InterviewFactory.workingFromUserDeck = true;
    $state.go('interview');
  };

  $scope.saveRecording = function() {

    // Grab blob craeted by recording
    var videoBlob = $scope.audioVideoRecorder.getBlob();
    // Create response based on this blob
    QuestionFactory.createVideo(videoBlob, questionObj);

  };

  $scope.stopRecording = function() {
    console.log('stopRecording called.');
    $scope.processInterview = !$scope.processInterview;

    var btnStartRecording = $window.document.getElementById('btn-start-recording');
    var btnStopRecording  = $window.document.getElementById('btn-stop-recording');

    var btnReplayRecording = $window.document.getElementById('btn-replay-recording');
    var btnExitRecording = $window.document.getElementById('btn-exit-recording');
    var btnSaveRecording = $window.document.getElementById('btn-save-recording');

    var downloadURL = $window.document.getElementById('download-url');

    btnStartRecording.disabled = false;
    btnStopRecording.disabled = true;
    btnExitRecording.disabled = false;
    btnSaveRecording.disabled = false;
    btnReplayRecording.disabled = false;
    btnReplayRecording.style.visibility = 'visible';
    videoElement.style.visibility = 'visible';
    downloadURL.innerHTML = '';

    btnStartRecording.innerHTML = 'Try Again';

    $scope.audioVideoRecorder.stopRecording(
      function(url) {
        console.log('stop recording fired with ', url);
        videoElement.src = url;
        videoElement.muted = false;
        videoElement.onended = function() {
          console.log('video element on');
          videoElement.pause();

          videoElement.src = $window.URL.createObjectURL($scope.audioVideoRecorder.getBlob());
        };
      }
    );
  };

  $scope.getQuestion();
});
