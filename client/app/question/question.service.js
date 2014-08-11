'use strict';

angular.module('pitchPerfectApp')


.factory('QuestionFactory', function() {

  var contextQuestion = {};

  return {
    contextQuestion: contextQuestion,
  };
});
