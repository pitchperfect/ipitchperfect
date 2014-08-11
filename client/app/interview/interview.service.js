'use strict';

angular.module('pitchPerfectApp')


.factory('InterviewFactory', function($http, $resource) {

  var questionObj = [];
  var contextObject = {};
  var workingFromUserDeck = false;


  var createAUserDeck = function () {debugger;
    var workingFromUserDeckRef = this.workingFromUserDeck;
    var objToPost = {};
    objToPost.deckId = this.contextObject._id;
    objToPost.title =  this.contextObject.title;
    objToPost.description =  this.contextObject.desciption;
    objToPost.questions =  this.contextObject.questions;
    objToPost.active =  true;

    $http.post('/api/userdecks', objToPost)
    .success(function(newUserDeck) {debugger;
      console.log('userDeck created:', newUserDeck);
      console.log('userDeck created from:', contextObject);
      workingFromUserDeckRef = true;
    });
  };


  var getQuestion = function (questionId, i, questionResponseStatusCb, questionReviewStatusCb) {
    console.log('getThisQuestion:', questionId);
    var questionObjReference = this.questionObj;

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
      questionObjReference[i] = temporyQuestionObj;
    }, function(err) {
      console.log('question err:', err);
    }); //.$promise; ???
  };


  return {
    questionObj: questionObj,
    contextObject: contextObject,
    workingFromUserDeck: workingFromUserDeck,
    createAUserDeck: createAUserDeck,
    getQuestion: getQuestion,
  };
});
