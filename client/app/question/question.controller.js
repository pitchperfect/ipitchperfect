'use strict';

angular.module('pitchPerfectApp')
  .controller('QuestionCtrl',
    function($scope, $window, $timeout, $interval, $upload, $state, $sce,
      QuestionFactory, InterviewFactory, ResponseFactory) {

      $scope.responseVideoUrl = null;
      $scope.mediaStream = null;
      $scope.audioVideoRecorder = null;
      $scope.alertUser = '';
      $scope.btnDisabled = {};
      $scope.videoShow = true;
      $scope.videoPlayShow = false;

      var responseId = null;
      var videoElement = $('#video-record')[0];
      var questionObj = QuestionFactory.contextQuestion;


      var init = function() {
        var loadVideo = false;

        if (!questionObj.selectedResponse){
          console.log('No target response. Not setting up a response video.');
        } else {
          console.log('Target response is ' + questionObj.selectedResponse._id);
          responseId = questionObj.selectedResponse._id;
          loadVideo = true;
        }

        var loadResponseVideo = function() {
          console.log('loadResponseVideo called.');

          // When the response is retrieved form the service, it will
          // use this function to update $scope elements
          var setDataCallback = function() {
            console.log('setDataCallback called.');

            // This is required by Angular to allow resources from other domains
            //  In our case, the video hosted on Azure
            var trustSrc = function(src) {
              return $sce.trustAsResourceUrl(src);
            };

            $scope.responseVideoUrl = trustSrc(ResponseFactory.responseContext.videoUrl);
            console.log('responseVideoUrl=' + $scope.responseVideoUrl);
            $scope.setUpResponsePlay($scope.responseVideoUrl);
          };

          console.log('calling ResponseFactory.getResponseData');
          ResponseFactory.getResponseData(responseId, setDataCallback);
        };

        if (loadVideo) {
          console.log('loadResponseVideo');
          loadResponseVideo();
        }
      };
      init();


      $scope.setUpResponsePlay = function(url) {
        console.log('setUpResponsePlay');
        $scope.btnDisabled.start = true;
        $scope.btnDisabled.stop = false;
        $scope.btnDisabled.exit = false;
        $scope.btnDisabled.save = false;
        $scope.btnDisabled.replay = false;

        $scope.processInterview = true;

        videoElement.src = url;
        videoElement.muted = false;
        videoElement.controls = true;
        //videoElement.play();
      };

      $scope.getQuestion = function() {
        var contextQuestion = QuestionFactory.contextQuestion;
        if ('fullQuestionObject' in contextQuestion) {
          $scope.question = QuestionFactory.contextQuestion.fullQuestionObject.title;
        }
      };

      $scope.startCountDown = function(time, message) {
        if (time > 1) {
          time--;
          $scope.alertUser = time;
          $timeout(function() {
            $scope.startCountDown(time, message);
          }, 750);
        } else {
          $scope.alertUser = message;
          $scope.startStopWatch();

          var btnStopRecording = $window.document.getElementById('btn-stop-recording');
          btnStopRecording.disabled = false;
          $scope.startRecording();
        }
      };

      $scope.startStopWatch = function() {
        $scope.sec = 0;
        $scope.min = 0;
        $interval(function() {
          if ($scope.sec === 59) {
            $scope.sec = 0;
            $scope.min = $scope.min + 1;
            $scope.alertUser = $scope.min + ' min, wrap up your answer!';
            return;
          }
          $scope.sec++;
          if ($scope.sec < 10) {
            $scope.sec = '0' + $scope.sec;
          }
        }, 1000, 0);
      };

      $scope.changeProcessInterviewStatus = function() {
        $scope.processInterview = !$scope.processInterview;

        if (!$scope.processInterview) {
          $scope.startCountDown(4, 'Recording started.');
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
        $scope.btnDisabled.start = true;
        $scope.btnDisabled.stop = false;
        $scope.btnDisabled.exit = true;
        $scope.btnDisabled.save = true;
        $scope.btnDisabled.replay = true;

        $scope.videoShow = true;

        $scope.captureUserMedia(
          function(stream) {
            $scope.mediaStream = stream;

            videoElement.src = $window.URL.createObjectURL(stream);
            videoElement.muted = true;
            videoElement.controls = false;
            videoElement.play();

            $scope.audioVideoRecorder = $window.RecordRTC(stream, {
              type: 'video'
            });
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
      };

      $scope.stopRecording = function() {
        console.log('stopRecording called.');
        $scope.processInterview = !$scope.processInterview;

        $scope.btnDisabled.start = false;
        $scope.btnDisabled.stop = true;
        $scope.btnDisabled.exit = false;
        $scope.btnDisabled.save = false;
        $scope.btnDisabled.replay = false;

        $scope.videoShow = true;

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

      var begin = function() {
        if (questionObj.selectedResponse) {
          //$scope.playResponse();
        } else {
          $scope.startCountDown(4, 'Recording started.');
          $scope.getQuestion();
        }
      };
      begin();
    });
