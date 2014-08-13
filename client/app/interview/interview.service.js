'use strict';

angular.module('pitchPerfectApp')


.factory('InterviewFactory', function($http, $resource) {

  var questionObj = [];
  var contextObject = {};
  var workingFromUserDeck = false;


  var createAUserDeck = function () {
    var workingFromUserDeckRef = workingFromUserDeck;  // ****
    var objToPost = {};
    objToPost.deckId = contextObject._id;  // ****
    objToPost.title =  contextObject.title;  // ****
    objToPost.description =  contextObject.desciption;  // ****
    objToPost.questions =  contextObject.questions;   // ****
    objToPost.active =  true;

    $http.post('/api/userdecks', objToPost)
    .success(function(newUserDeck) {
      console.log('userDeck created:', newUserDeck);
      console.log('userDeck created from:', contextObject);
      workingFromUserDeckRef = true;
    });
  };


  var getQuestion = function (i, questionResponseStatusCb, questionReviewStatusCb) {debugger;
    var questionId = this.contextObject.questions[i];  //******

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

    getQuestions.get({}, function(question) { debugger;
      var temporyQuestionObj = {};
      temporyQuestionObj.fullQuestionObject = question;
      temporyQuestionObj.responseStatus = questionResponseStatusCb(questionId);
      temporyQuestionObj.peerReviewStatus = questionReviewStatusCb(questionId);

      questionObj[i] = temporyQuestionObj;  //0**
    }, function(err) {
      console.log('question err:', err);
    });
  };


  return {
    questionObj: questionObj,
    contextObject: contextObject,
    workingFromUserDeck: workingFromUserDeck,
    createAUserDeck: createAUserDeck,
    getQuestion: getQuestion,
  };
});








// 'use strict';
//
// angular.module('pitchPerfectApp')
//
//
// .factory('InterviewFactory', function($http, $resource) {
//
//   var questionObj = [];
//   var contextObject = {};
//   var workingFromUserDeck = false;
//
//
//   var createAUserDeck = function () {
//     var workingFromUserDeckRef = this.workingFromUserDeck;
//     var objToPost = {};
//     objToPost.deckId = this.contextObject._id;
//     objToPost.title =  this.contextObject.title;
//     objToPost.description =  this.contextObject.desciption;
//     objToPost.questions =  this.contextObject.questions;
//     objToPost.active =  true;
//
//     $http.post('/api/userdecks', objToPost)
//     .success(function(newUserDeck) {
//       console.log('userDeck created:', newUserDeck);
//       console.log('userDeck created from:', contextObject);
//       workingFromUserDeckRef = true;
//     });
//   };
//
//
//   var getQuestion = function (i, questionResponseStatusCb, questionReviewStatusCb) {debugger;
//     var questionId = this.contextObject.questions[i];
//
//     console.log('getThisQuestion:', questionId);
//     // var questionObjReference = this.questionObj;
//
//     var getQuestions = $resource('/api/questions/:id/', {
//       id: '@_id'
//     },
//     {
//       get: {
//         method: 'GET',
//         params: {
//           id: questionId
//         }
//       }
//     });
//
//     getQuestions.get({}, function(question) {debugger;
//       var temporyQuestionObj = {};
//       temporyQuestionObj.fullQuestionObject = question;
//       temporyQuestionObj.responseStatus = questionResponseStatusCb(questionId);
//       temporyQuestionObj.peerReviewStatus = questionReviewStatusCb(questionId);
//
//       questionObj[i] = temporyQuestionObj;
//       //questionObjReference[i] = temporyQuestionObj;
//     }, function(err) {
//       console.log('question err:', err);
//     }); //.$promise; ???
//   };
//
//
//   return {
//     questionObj: questionObj,
//     contextObject: contextObject,
//     workingFromUserDeck: workingFromUserDeck,
//     createAUserDeck: createAUserDeck,
//     getQuestion: getQuestion,
//   };
// });
