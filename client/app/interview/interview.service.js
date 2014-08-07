'use strict';

angular.module('pitchPerfectApp')


.factory('InterviewFactory', function() {

  var questionObj = [];
  var contextObject = {};

  return {
    questionObj: questionObj,
    contextObject: contextObject,
  };
});
