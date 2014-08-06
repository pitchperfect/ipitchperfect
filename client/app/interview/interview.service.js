'use strict';

angular.module('pitchPerfectApp')


.factory('InterviewFactory', function() {
  
  var questionObj = {};
  var userDeck = {};

  return {
    questionObj: questionObj,
    userDeck: userDeck,
  };
});
