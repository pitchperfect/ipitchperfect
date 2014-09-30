'use strict';
/*globals Popcorn */

angular.module('pitchPerfectApp')
  .controller('ReviewCtrlView', function($scope, $state, $stateParams, $sce, ReviewFactory, InterviewFactory) {

    if (!$stateParams.reviewId){
      console.log('no target review, going home');
      $state.go('home');
    }

    var reviewId = $stateParams.reviewId;

    $scope.url = '';

    // When the response is retrieved form the service, it will
    // use this function to update $scope elements
    var setDataCallback = function(theData) {

      $scope.question = theData.questionTitle;
      $scope.allAnnotations = theData.annotations;

      // This is required by Angular to allow resources from other domains
      //  In our case, the video hosted on Azure
      var trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
      };

      $scope.url = trustSrc(theData.videoUrl);

    };

    ReviewFactory.getReviewData(reviewId, setDataCallback);


    // Popcorn is lib for video features
    var popcorn = new Popcorn('#video-response');
    popcorn.play();

    $scope.allAnnotations = [];

    // Set the palyhead timeline to that of the annotation
    $scope.playAnnotation = function(timelinePosition) {
      popcorn.pause();
      popcorn.currentTime(timelinePosition);
      popcorn.play();

    };

    $scope.goToInterview = function() {
      InterviewFactory.workingFromUserDeck = true;
      $state.go('interview');
    };


  });
