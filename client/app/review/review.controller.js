'use strict';
/*globals Popcorn */

angular.module('pitchPerfectApp')
  .controller('ReviewCtrl', function($scope, $sce, ReviewFactory) {
    $scope.message = 'Hello';

    $scope.url;

    var responseData = {};


    var setDataCallback = function(url, qTitle){
      console.log('in callback using url  ', url);
      console.log('in callback using title  ', qTitle);

      $scope.question = qTitle;

      var trustSrc = function(src) { return $sce.trustAsResourceUrl(src)};

      $scope.url = trustSrc(url);
      var myVideo = document.getElementById("video-response");
      myVideo.play();

    };
    // response id 53ed37212970f95b1d3b1484
    ReviewFactory.getResponseVideoUrl('53ed4c988fa3693424381f62', setDataCallback);

    var popcorn = new Popcorn('#video-response');
    popcorn.play();

    $scope.allAnnotations = [];

    $scope.stagedAnnotation = {};

    $scope.saveReview = function(){

      console.log('going to save these comments', $scope.allAnnotations);
      console.log('response context data at this point ', ReviewFactory.responseContextData);

      var createReviewData = {};
      createReviewData.annotations = $scope.allAnnotations;
      createReviewData.responseId = ReviewFactory.responseContextData.responseObj._id;
      createReviewData.questionId = ReviewFactory.responseContextData.questionObj._id;

      ReviewFactory.saveReview(createReviewData);

    }

    $scope.addAnnotation = function() {
      popcorn.pause();
      $scope.stagedAnnotation.timelineActual = popcorn.currentTime();
      console.log('staged annotation is ', $scope.stagedAnnotation);
    };

    $scope.saveAnnotation = function(annotationText) {
      console.log('new text is ', annotationText);
      $scope.stagedAnnotation.description = annotationText;

      console.log('about tp push ', $scope.stagedAnnotation);
      $scope.allAnnotations.push($scope.stagedAnnotation);
      $scope.stagedAnnotation = {};
      $scope.annotationText = '';
      $('#annotationText').blur();
      popcorn.play();
    };

    $scope.playAnnotation = function(timelinePosition) {

      popcorn.pause();
      popcorn.currentTime(timelinePosition);
      popcorn.play();

    };



  });
