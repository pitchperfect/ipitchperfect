'use strict';

angular.module('pitchPerfectApp')


.factory('ReviewFactory', function($http, $q) {

  var responseContextData = {};

    var getResponseData = function(responseId, callback) {

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


        var saveReview = function(createReviewData) {

          $http.post('/api/reviews', createReviewData)
            .success(function(newReview) {
              console.log('New Review Created', newReview);
              //update user deck with this review
              //push to it?

              // Userdeck.findById(newReview.userDeckId, function(err, userDeck) {
              //   if (err) return validationError(res, err);
              //   userDeck.reviews.push(newReview);
              //   userDeck.save(function(err, updatedUserDeck) {
              //     if (err) return validationError(res, err);
              //     // res.json({
              //     //   data: photo
              //     // });
              //   });
              // });

            });
        };
        return {
          getResponseData: getResponseData,
          responseContextData: responseContextData,
          saveReview:saveReview
        };
      });
