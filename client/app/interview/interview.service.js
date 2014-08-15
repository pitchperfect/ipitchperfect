'use strict';

angular.module('pitchPerfectApp')


.factory('InterviewFactory', function($http, $resource) {

  var contextObject = {};
  var workingFromUserDeck = false;


  var createAUserDeck = function (addUserDeckIdToQuestion) {
    var workingFromUserDeckRef = this.workingFromUserDeck;
    var contextObjectRef = this.contextObject;

    var tempObj = {};
    tempObj.deckId = this.contextObject._id;
    tempObj.title =  this.contextObject.title;
    tempObj.description =  this.contextObject.desciption;
    tempObj.questions =  this.contextObject.questions;
    tempObj.active =  true;

    $http.post('/api/userdecks', tempObj)
    .success(function(newUserDeck) {
      // Use the callback to tie this new deck id to the question object
      addUserDeckIdToQuestion(newUserDeck._id);
      workingFromUserDeckRef = true;
      contextObjectRef._id = newUserDeck._id;
    });
  };


  var getQuestion = function (i, questionResponseStatusCb, questionReviewStatusCb) {
    var contextRef = this.contextObject;
    var questionId = contextRef.questions[i];

    console.log('getThisQuestion:', questionId);

    var getQuestions = $resource('/api/questions/:id/', {
      id: '@_id'
    },
    {
      get: {
        method: 'GET',
        params: {
          id: questionId
        }
      }
    });

    getQuestions.get({}, function(question) {
      var temporyQuestionObj = {};
      temporyQuestionObj.fullQuestionObject = question;
      temporyQuestionObj.responseStatus = questionResponseStatusCb(questionId);
      temporyQuestionObj.peerReviewStatus = questionReviewStatusCb(questionId);

      contextRef.questionsStore[i] = temporyQuestionObj;
    }, function(err) {
      console.log('question err:', err);
    });
  };


  return {
    contextObject: contextObject,
    workingFromUserDeck: workingFromUserDeck,
    createAUserDeck: createAUserDeck,
    getQuestion: getQuestion,
  };
});
