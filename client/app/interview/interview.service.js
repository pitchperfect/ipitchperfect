'use strict';

angular.module('pitchPerfectApp')


.factory('InterviewFactory', function($http) {

  var questionObj = [];
  var contextObject = {};
  var workingFromUserDeck = false;


  var createAUserDeck = function () {
    var objToPost = {};
      objToPost.deckId = this.contextObject._id;
      objToPost.title =  this.contextObject.title;
      objToPost.description =  this.contextObject.desciption;
      objToPost.questions =  this.contextObject.questions;
      objToPost.active =  true;

    $http.post('/api/userdecks', objToPost)
    .success(function(newUserDeck) {
      console.log('userDeck created:', newUserDeck);
      console.log('userDeck created from:', contextObject);
    });
  };

  return {
    questionObj: questionObj,
    contextObject: contextObject,
    workingFromUserDeck: workingFromUserDeck,
    createAUserDeck: createAUserDeck,
  };
});
