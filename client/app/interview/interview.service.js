'use strict';

angular.module('pitchPerfectApp')


.factory('InterviewFactory', function() {

  var questionObj = {};
  var userDeck = {};
  var contextObject = {};

  return {
    questionObj: questionObj,
    userDeck: userDeck,
    contextObject: contextObject,
  };
});
