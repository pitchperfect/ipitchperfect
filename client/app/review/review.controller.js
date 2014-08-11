'use strict';

angular.module('pitchPerfectApp')
  .controller('ReviewCtrl', function($scope) {
      $scope.message = 'Hello';



      var popcorn = Popcorn("#video-response");

      $scope.allAnnotations = [];

      $scope.stagedAnnotation = {};

      $scope.addAnnotation = function() {
        popcorn.pause();

        $scope.stagedAnnotation.timelineActual = popcorn.currentTime();

        console.log('staged annotation is ', $scope.stagedAnnotation);
      };

      $scope.saveAnnotation = function(annotationText) {
        console.log('new text is ', annotationText);
        $scope.stagedAnnotation.description = annotationText;
        $scope.stagedAnnotation.title = 'My New Annotation';

        console.log('about tp push ', $scope.stagedAnnotation);
        $scope.allAnnotations.push($scope.stagedAnnotation);
        $scope.stagedAnnotation = {};
        $scope.annotationText = '';
        $('#annotationText').blur();
        popcorn.play();
      };

      $scope.playAnnotation = function(timelinePosition){

        popcorn.pause();

        alert('this should rewind the video to this point.  FF angular issue to be fixed');

      };

     

    

});