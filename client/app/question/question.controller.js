'use strict';

angular.module('pitchPerfectApp')
  .controller('QuestionCtrl',
    function ($scope, $window, $timeout, $interval, $upload, QuestionFactory, $state, InterviewFactory) {

  $scope.mediaStream = null;
  $scope.audioVideoRecorder = null;
  $scope.alertUser = '';


  // *********** Celine's start ************  //
  $scope.getQuestion = function () {
    console.log('testing contextQuestion Obj:', QuestionFactory.contextQuestion);
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

  $scope.startCountDown(4, 'Camera Rolling!');

  $scope.changeProcessInterviewStatus = function () {
    $scope.processInterview = !$scope.processInterview;

    if(!$scope.processInterview) {
      $scope.startCountDown(4, 'Camera Rolling!');
    }
  };
  // ***** Celine's end ********//

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

    var videoElement = $window.document.getElementById('video-record');
    var downloadURL = $window.document.getElementById('download-url');

    btnStartRecording.disabled = true;
    btnStopRecording.disabled = false;
    btnExitRecording.disabled = true;
    btnSaveRecording.disabled = true;
    btnReplayRecording.disabled = true;
    videoElement.style.visibility = 'visible';
    downloadURL.innerHTML = 'Smile, you are being recorded';

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
    var videoElement = $window.document.getElementById('video-record');
    videoElement.play();
  };

  $scope.exitRecording = function() {
    // $window.alert('redirect to UserDeck');
    InterviewFactory.workingFromUserDeck = true;
    $state.go('interview');
  };

  $scope.saveRecording = function() {
    // $window.alert('hit /videos/url/:id endpoint');
    $state.go('share');
  };

  $scope.postFile = function(video) {
    var videoElement = $window.document.getElementById('video-record');
    videoElement.src = '';

    $scope.xhr('/api/videos', video,

      // success
      function(fileName) {
        console.log('xhr anon function called for ' + fileName);

        // var href = location.href.substr(0, location.href.lastIndexOf('/') + 1);
        // videoElement.src = href + 'api/videos/' + _fileName;
        // videoElement.play();
        // videoElement.muted = false;
        // videoElement.controls = true;
        //
        // var h2 = document.createElement('h2');
        // h2.innerHTML = '<a href="' + videoElement.src + '">' + videoElement.src + '</a>';
        // document.body.appendChild(h2);
      }
    );

    if ($scope.mediaStream) {
      $scope.mediaStream.stop();
    }
  };

  $scope.xhr = function(url, data) {
    $upload.upload({
      url: url,
      //method: 'POST' or 'PUT',
      //headers: {'header-key': 'header-value'},
      //withCredentials: true,
      data: {key: 'value'},
      file: data.blob,
    }).progress(
      function(evt) {
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }
    ).success(
      function(data) {
        console.log(data);
      }
    );
  };


  $scope.stopRecording = function() {
    console.log('stopRecording called.');
    $scope.processInterview = !$scope.processInterview;

    var btnStartRecording = $window.document.getElementById('btn-start-recording');
    var btnStopRecording  = $window.document.getElementById('btn-stop-recording');

    var btnReplayRecording = $window.document.getElementById('btn-replay-recording');
    var btnExitRecording = $window.document.getElementById('btn-exit-recording');
    var btnSaveRecording = $window.document.getElementById('btn-save-recording');

    var videoElement = $window.document.getElementById('video-record');
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
        videoElement.src = url;
        videoElement.muted = false;
        videoElement.onended = function() {
          videoElement.pause();

          videoElement.src = $window.URL.createObjectURL($scope.audioVideoRecorder.getBlob());

          $scope.onStopRecording();
        };
      }
    );
  };

  $scope.onStopRecording = function() {
    console.log('onStopRecording called.');

    $scope.audioVideoRecorder.getDataURL(
      function(audioVideoDataURL) {
        var av = {
          blob: $scope.audioVideoRecorder.getBlob(),
          dataURL: audioVideoDataURL
        };

        $scope.postFile(av);
      }
    );
  };

  $scope.getQuestion();
});
