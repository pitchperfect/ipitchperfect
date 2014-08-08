'use strict';

angular.module('pitchPerfectApp')
  //.controller('QuestionCtrl', ['$scope', '$window', '$timeout',
  .controller('QuestionCtrl',
    function ($scope, $window, $timeout, $interval, QuestionFactory) {

  $scope.mediaStream = null;
  $scope.videoRecorder = null;
  $scope.audioRecorder = null;


  // *********** Celine's start ************  //
  $scope.question = QuestionFactory.contextObject.fullQuestionObject.title;
  $scope.alertUser = '';

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

  // On-click for start recording
  $scope.startRecording = function() {
    //var navigator = $window.navigator;
    var btnStartRecording = $window.document.getElementById('btn-start-recording');
    var btnStopRecording  = $window.document.getElementById('btn-stop-recording');
    var videoElement      = $window.document.getElementById('video-record');

    // Firefox can record both audio/video in single webm container
    // Don't need to create multiple instances of the RecordRTC for Firefox
    // You can even use below property to force recording only audio blob on chrome
    //var isRecordOnlyAudio = !!navigator.mozGetUserMedia;
    var isRecordOnlyAudio = false;


    btnStartRecording.disabled = true;

    $scope.captureUserMedia( function(stream) {
      $scope.mediaStream = stream;

      // need videoElement variable decl
      videoElement.src = $window.URL.createObjectURL(stream);
      videoElement.play();
      videoElement.muted = true;
      videoElement.controls = false;

      var audioConfig = {};
      if (!isRecordOnlyAudio) {
        audioConfig.onAudioProcessStarted = function() {
          // invoke video recorder in this callback to get maximum sync
          $scope.videoRecorder.startRecording();
        };
      }
      $scope.audioRecorder = $window.RecordRTC(stream, audioConfig);


      if (!isRecordOnlyAudio) {
        var videoConfig = { type: 'video' };
        $scope.videoRecorder = $window.RecordRTC(stream, videoConfig);
      }
      $scope.audioRecorder.startRecording();

      // enable stop-recording button
      btnStopRecording.disabled = false;
    });
  };

  $scope.initRecording = function() {
    // fetching DOM references
    var navigator = $window.navigator;

    var videoElement = $window.document.getElementById('video-record');
    var currentBrowser = !!navigator.mozGetUserMedia ? 'gecko' : 'chromium';

    // Firefox can record both audio/video in single webm container
    // Don't need to create multiple instances of the RecordRTC for Firefox
    // You can even use below property to force recording only audio blob on chrome
    // var isRecordOnlyAudio = true;
    //var isRecordOnlyAudio = !!navigator.mozGetUserMedia;
    var isRecordOnlyAudio = false;



    // if recording only audio, we should replace "HTMLVideoElement" with "HTMLAudioElement"
    if (isRecordOnlyAudio && currentBrowser === 'chromium') {
      var parentNode = videoElement.parentNode;
      parentNode.removeChild(videoElement);

      videoElement = document.createElement('audio');
      videoElement.style.padding = '.4em';
      videoElement.controls = true;
      parentNode.appendChild(videoElement);
    }
  };

  $scope.postFiles = function(audio, video) {
    console.log('postFiles called');

    // getting unique identifier for the file name
    var fileName = $scope.generateRandomString();
    var videoElement = $window.document.getElementById('video-record');

    // this object is used to allow submitting multiple recorded blobs
    var files = { };

    // recorded audio blob
    files.audio = {
      name: fileName + '.' + audio.blob.type.split('/')[1],
      type: audio.blob.type,
      contents: audio.dataURL
    };

    if (video) {
      files.video = {
        name: fileName + '.' + video.blob.type.split('/')[1],
        type: video.blob.type,
        contents: video.dataURL
      };
    }

    files.uploadOnlyAudio = !video;

    videoElement.src = '';
    //videoElement.poster = '/ajax-loader.gif';

    $scope.xhr('/share', JSON.stringify(files), function(_fileName) {
      console.log('xhr anon function called for ' + _fileName);

      var href = location.href.substr(0, location.href.lastIndexOf('/') + 1);
      videoElement.src = href + 'share/' + _fileName;
      videoElement.play();
      videoElement.muted = false;
      videoElement.controls = true;

      var h2 = document.createElement('h2');
      h2.innerHTML = '<a href="' + videoElement.src + '">' + videoElement.src + '</a>';
      document.body.appendChild(h2);
    });

    if ($scope.mediaStream) {
      $scope.mediaStream.stop();
    }
  };

  // XHR2/FormData
  $scope.xhr = function(url, data, callback) {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
        callback(request.responseText);
      }
    };

    request.open('POST', url);
    request.responseType = 'blob';
    request.send(data);
  };

  $scope.generateRandomString = function() {
    console.log('generateRandomString called.');
    var token = '';

    if ($window.crypto) {
      var a = $window.crypto.getRandomValues(new Uint32Array(3));
      for (var i = 0, l = a.length; i < l; i++) {
        token += a[i].toString(36);
      }
    } else {
      token = (Math.random() * new Date().getTime()).toString(36).replace( /\./g , '');
    }
    console.log('generateRandomString returning ' + token);
    return token;
  };


  $scope.stopRecording = function() {
    console.log('stopRecording called.');
    $scope.processInterview = !$scope.processInterview;

    var btnStartRecording = $window.document.getElementById('btn-start-recording');
    var btnStopRecording  = $window.document.getElementById('btn-stop-recording');

    //var isRecordOnlyAudio = !!navigator.mozGetUserMedia;
    var isRecordOnlyAudio = false;

    btnStartRecording.disabled = false;
    btnStopRecording.disabled = true;

    if (isRecordOnlyAudio) {
      $scope.audioRecorder.stopRecording($scope.onStopRecording);
    }

    if(!isRecordOnlyAudio) {
      $scope.audioRecorder.stopRecording( function() {
        $scope.videoRecorder.stopRecording( function() {
          $scope.onStopRecording();
        });
      });
    }
  };

  // when btnStopRecording is clicked
  $scope.onStopRecording = function() {
    console.log('onStopRecording called.');

    //var navigator = $window.navigator;
    //var isRecordOnlyAudio = !!navigator.mozGetUserMedia;
    var isRecordOnlyAudio = false;

    $scope.audioRecorder.getDataURL( function(audioDataURL) {
      var audio = {
        blob: $scope.audioRecorder.getBlob(),
        dataURL: audioDataURL
      };

      // if record both wav and webm
      if(!isRecordOnlyAudio) {
        $scope.videoRecorder.getDataURL( function(videoDataURL) {
          var video = {
            blob: $scope.videoRecorder.getBlob(),
            dataURL: videoDataURL
          };

          $scope.postFiles(audio, video);
        });
      }

      // if record only audio (either wav or ogg)
      if (isRecordOnlyAudio) {
        $scope.postFiles(audio);
      }
    });
  };

});
//}]);
