'use strict';

angular.module('pitchPerfectApp')


.factory('QuestionFactory', function($upload) {

  var contextQuestion = {};

  var createVideo = function(blob){

  	$upload.upload({
      url: '/api/videos',
      data: {key: 'value'},
      file: blob,
    }).progress(
      function(evt) {
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }
    ).success(
      function(data) {
        createResponse(data._id);
      }
    );
  };

  var createResponse = function(videoId){
  	console.log('Will use this id to create Response ', videoId);

    


  };

  return {
    contextQuestion: contextQuestion,
    createVideo: createVideo
  };
});
