'use strict';

var _ = require('lodash');
var Userdeck = require('./userdeck.model');
var Deck = require('../deck/deck.model');

// Get list of userdecks
exports.index = function(req, res) {
  Userdeck.find({
    userId: req.user._id
  }, function(err, userdecks) {
    if (err) {
      return handleError(res, err);
    }

    var idsToExclude = userdecks.map(function(userDeck) {
      return userDeck.deckId;
    });

    Deck.find({
      _id: {
        $nin: idsToExclude
      }
    }, function(err, decks) {
      if (err) {
        return handleError(res, err);
      }

      var returnObj = [userdecks, decks];
      return res.json(200, returnObj);
    });

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
  req.body.userId = req.user._id;

  Userdeck.create(req.body, function(err, userdeck) {
    if (err) {
      return handleError(res, err);
    }

    return res.json(201, userdeck);
  });
};

// Updates an existing UserDeck response in the DB.
exports.updateResponse = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  console.log('req.params.id', req.params.id);
  // Find the right deck
  Userdeck.findById(req.params.id, function(err, userdeck) {
    var keysToUpdate = {};
    var questionResponded;
    console.log('****userdeck found', userdeck);
    console.log('****first found ?', userdeck.responses[req.body.questionId]);

    if (err) {
      return handleError(res, err);
    }
    if (!userdeck) {
      return res.send(404);
    }

    // Model looks like response: {'questionId':'[responseId 1, responseID 2]'}
    // If previous responses exist, push this new one onto the array
    if (userdeck.responses[req.body.questionId]) {

      var array = userdeck.responses[req.body.questionId];
      array.push(req.body.responseId);

      // Mongo string move
      questionResponded = 'responses.' + req.body.questionId;
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
      questionResponded = 'responses.' + req.body.questionId;
      keysToUpdate[questionResponded] = [req.body.responseId];
      console.log(keysToUpdate);
      // Use the $set Mongo move
      userdeck.update({
        $set: keysToUpdate
      }, function(err, deck) {
        console.log('final update:', deck)
        // Console.log('arguments', arguments);
        // Would be nice to get an err status here
      });
    }
  });
};

// Updates an existing UserDeck review in the DB.
exports.updateReview = function(req, res) {

  Userdeck.findById(req.params.id, function(err, userdeck) {
    var keysToUpdate = {};
    var responseResponded;

    if (err) {
      return handleError(res, err);
    }
    if (!userdeck) {
      return res.send(404);
    }

    // If previous reviews exist, push this new one on the array
    if (userdeck.reviews[req.body.responseId]) {

      var array = userdeck.reviews[req.body.responseId];
      array.push(req.body.reviewId);

      // Mongo string move
      responseResponded = 'reviews.' + req.body.responseId;
      keysToUpdate[responseResponded] = array;

      // Update the UserDeck with the updated review array
      // Use the $set Mongo move
      userdeck.update({
        $set: keysToUpdate
      }, function() {

        return res.json(userdeck);
        // Console.log('arguments', arguments);
        // Would be nice to get an err status here
      });

    } else {
      // First Review for this Response, so create the array

      // Mongo string move
      responseResponded = 'reviews.' + req.body.responseId;
      keysToUpdate[responseResponded] = [req.body.reviewId];

      // Use the $set Mongo move
      userdeck.update({
        $set: keysToUpdate
      }, function(err, deck) {
        return res.json(userdeck);
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
