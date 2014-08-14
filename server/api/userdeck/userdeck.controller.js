'use strict';

var _ = require('lodash');
var Userdeck = require('./userdeck.model');

// Get list of userdecks
exports.index = function(req, res) {
  Userdeck.find(function(err, userdecks) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(200, userdecks);
  });
};

// Get a single userdeck
exports.show = function(req, res) {
  Userdeck.findById(req.params.id, function(err, userdeck) {
    if (err) {
      return handleError(res, err);
    }
    if (!userdeck) {
      return res.send(404);
    }
    return res.json(userdeck);
  });
};

// Creates a new userdeck in the DB.
exports.create = function(req, res) {
  console.log('^^^^^^^^^ userdeck create req.body', req.body);
  // requires: {userId: userId, deck: deckId, questionsResponded: {}, responsesReviewed: {}, active: true};
  // after object is created, requires: questionId, responseId
  Userdeck.create(req.body, function(err, userdeck) {
    console.log('^^^^^^^^ userdeck created: ', userdeck);
    if (err) {
      return handleError(res, err);
    }

    // if (!... ) {
    //   userdeck.questionsResponded = {};
    // }
    // if (!userdeck.responsesReviewed) {
    //   userdeck.responsesReviewed = {};
    // }
    //
    // userdeck.save();

    return res.json(201, userdeck);
  });
};

// Updates an existing userdeck in the DB.
exports.update = function(req, res) {
  if (req.body._id) { delete req.body._id; }
    
  Userdeck.findById(req.params.id, function(err, userdeck) {
    if (err) {return handleError(res, err); }
      
    if (!userdeck) { return res.send(404); }

    // If previous responses exist, push this new one on the array
    if (userdeck.responses[req.body.questionId]) {

      var array = userdeck.responses[req.body.questionId];
      array.push(req.body.responseId);

      // Mongo string move
      var keysToUpdate = {};
      var questionResponded = 'responses.' + req.body.questionId;
      keysToUpdate[questionResponded] = array;

      // Use the $set Mongo move
      userdeck.update({
        $set: keysToUpdate
      }, function() {
        // Console.log('arguments', arguments);
        // Would be nice to get an err status here
      });

    } else {
      // First response for Question, so create the array

      // Mongo string move
      var keysToUpdate = {};
      var questionResponded = 'responses.' + req.body.questionId;
      keysToUpdate[questionResponded] = [req.body.responseId];

      // Use the $set Mongo move
      userdeck.update({
        $set: keysToUpdate
      }, function(err, deck) {
        // Console.log('arguments', arguments);
        // Would be nice to get an err status here
      });
    }
  });
};

// Deletes a userdeck from the DB.
exports.destroy = function(req, res) {
  Userdeck.findById(req.params.id, function(err, userdeck) {
    if (err) {
      return handleError(res, err);
    }
    if (!userdeck) {
      return res.send(404);
    }
    userdeck.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}