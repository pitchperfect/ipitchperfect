'use strict';
/*globals Popcorn */

angular.module('pitchPerfectApp')
  .controller('ReviewCtrlCreate', function($scope, $sce, ReviewFactory) {

    debugger;
    //if reviewMode = Create then
        //  targetResponse = responseId to use
    // if reviewMode = View then
      //

    $scope.url;

    var responseData = {};

    // When the response is retrieved form the service, it will
    // use this function to update $scope elements
    var setDataCallback = function(url, qTitle) {

      $scope.question = qTitle;
      // This is required by Angular to allow resources from other domains
      //  In our case, the video hosted on Azure
      var trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src)
      };

      $scope.url = trustSrc(url);

      // Attempt to auto play video after load.  Not working.
      var myVideo = document.getElementById("video-response");
      myVideo.play();

    };
    // Hard code response_id for testing.  TBD.
    alert('hard code the response id in the review controller for this to work');
    //break;
    ReviewFactory.getResponseData('53efc88aec24afc92b95cc0f', setDataCallback);

    // Popcorn is lib for video features
    var popcorn = new Popcorn('#video-response');
    popcorn.play();

    $scope.allAnnotations = [];

    $scope.stagedAnnotation = {};

    $scope.saveReview = function() {

      // Assemble pertinent data for the new Review Object
      var createReviewData = {};
      createReviewData.annotations = $scope.allAnnotations;
      createReviewData.responseId = ReviewFactory.responseContext.responseObj._id;
      createReviewData.questionId = ReviewFactory.responseContext.questionObj._id;
      createReviewData.responseCreatorId = ReviewFactory.responseContext.responseObj.userId;
      createReviewData.videoId = ReviewFactory.responseContext.responseObj.videoId;
      createReviewData.userDeckId = ReviewFactory.responseContext.responseObj.userDeckId;

      // Create the Review
      ReviewFactory.saveReview(createReviewData);

    };

    //  Captures playhead timeline at time of annotation
    $scope.addAnnotation = function() {
      popcorn.pause();
      $scope.stagedAnnotation.timelineActual = popcorn.currentTime();
    };

    // Collect the annotation, clear the text entry field
    $scope.saveAnnotation = function(annotationText) {
      $scope.stagedAnnotation.description = annotationText;

      $scope.allAnnotations.push($scope.stagedAnnotation);
      $scope.stagedAnnotation = {};
      $scope.annotationText = '';
      $('#annotationText').blur();
      popcorn.play();
    };

    // Set the palyhead timeline to that of the annotation
    $scope.playAnnotation = function(timelinePosition) {
      popcorn.pause();
      popcorn.currentTime(timelinePosition);
      popcorn.play();

    };

  });
