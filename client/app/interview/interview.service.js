'use strict';

angular.module('pitchPerfectApp')


.factory('InterviewFactory', function($http, $resource) {

  var contextObject = {
    _id: null,
    title: null,
    description: null,
    questions: [],
    questionsStore: [],
    active: false,
    responses: {}, // key=questionId, value=response from mongo
    reviews: {},
  };

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

  var getResponsesForQuestion = function(questionId, contextRef) {
    console.log('getResponsesForQuestion(): ' + questionId);
    if (!contextRef.responses) {
      contextRef.responses = {};
    } else {
      delete contextRef.responses[questionId];
    }

    var ResponseResource = $resource('/api/responses/forQuestion/:id',
    {
      id: questionId
    },
    {
      get: {
        method: 'GET',
        isArray: true,
        params: {
          id: questionId
        }
      }
    });

    var responses = ResponseResource.query(function() {
      for (var x=0; x<responses.length; x++) {
        var response = responses[x];
        contextRef.responses[questionId] = [];
        contextRef.responses[questionId].push(response);
      }
    });
  };

  var getReviewsForQuestion = function(questionId, contextRef) {
    console.log('getReviewsForQuestion(): ' + questionId);
    if (!contextRef.reviews) {
      contextRef.reviews = {};
    } else {
      delete contextRef.reviews[questionId];
    }

    var ReviewResource = $resource('/api/reviews/forQuestion/:id',
    {
      id: questionId
    },
    {
      get: {
        method: 'GET',
        isArray: true,
        params: {
          id: questionId
        }
      }
    });

    var reviews = ReviewResource.query(function() {
      for (var x=0; x<reviews.length; x++) {
        var review = reviews[x];
        contextRef.reviews[questionId] = [];
        contextRef.reviews[questionId].push(review);
      }
    });
  };

  var getQuestion = function (i) {
    var contextRef = this.contextObject;
    var questionId = contextRef.questions[i];

    getResponsesForQuestion(questionId, contextRef);
    getReviewsForQuestion(questionId, contextRef);

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
      var questionData = {
        fullQuestionObject: question,
        // responseStatus: null,
        // peerReviewStatus: null

      };

      // questionData.responseStatus = questionResponseStatusCb(questionId);
      // questionData.peerReviewStatus = questionReviewStatusCb(questionId);

      contextRef.questionsStore[i] = questionData;
    }, function(err) {
      console.log('question err:', err);
    });
  };


  return {
    contextObject: contextObject,
    workingFromUserDeck: workingFromUserDeck,
    createAUserDeck: createAUserDeck,
    getQuestion: getQuestion,
    getReviewsForQuestion : getReviewsForQuestion
  };
});
