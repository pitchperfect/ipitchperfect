'use strict';

angular.module('pitchPerfectApp')


.factory('ReviewFactory', function($http, $q) {

  var responseContextData = {};



    var getResponseVideoUrl = function(responseId, callback) {

      var promises = [];

      var theData = {};


      console.log('in get repsonse video url ctrl');

      var responseObj = $http.get('/api/responses/' + responseId)
        .success(function(resp) {

          responseContextData.responseObj = resp;

          console.log('the response obj is ', resp);
          return resp;
        });

      responseObj.then(function(data) {

          console.log('the then data ', data);

          var questionObj = $http.get('/api/questions/' + data.data.questionId)
            .success(function(resp) {

              responseContextData.questionObj = resp;

              theData.questionTitle = resp.title;

              console.log('the question obj is ', resp.title);

            });

          promises.push(questionObj);

          var videoUrl = $http.get('/api/videos/url/' + data.data.videoId)
            .success(function(resp) {

              responseContextData.videoObj = resp;

              theData.videoUrl = resp.url;

              console.log('the video url is ', resp);

            });

          promises.push(videoUrl);

          $q.all(promises).then(function() {
            console.log('the data ', theData);

            callback(theData.videoUrl, theData.questionTitle);
          });

        });


      };



        var createReview = function(createReviewData) {


          $http.put('/api/userdecks/' + deckId, tempObj)
            .success(function(updatedQuestion) {
              console.log('Question Updated!', updatedQuestion);

            });
        };

        return {
          getResponseVideoUrl: getResponseVideoUrl,
          responseContextData: responseContextData
        };
      });
