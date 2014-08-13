'use strict';

var _ = require('lodash');
var Deck = require('./deck.model');
var Question = require('../question/question.model');
// var User = require('../user/user.model');
// var Response = require('../response/response.model');

// Get list of decks
exports.index = function(req, res) {
  Deck.find(function (err, decks) {
    if(err) { return handleError(res, err); }
    return res.json(200, decks);
  });
};


// Get a single deck
exports.show = function(req, res) {
  Deck.findById(req.params.id, function (err, deck) {
    if(err) { return handleError(res, err); }
    if(!deck) { return res.send(404); }
    return res.json(deck);
  });
};


// Creates a new deck in the DB.
exports.create = function(req, res) {
  console.log('^^^^ req.body input in desk create:', req.body);

  /* CREATE Questions */
  req.body.questions = [];
  var qCollection = req.body.questionsCollection;

  if (qCollection.length) {

    var postQuestionObject = {
      title: '',
      active: true,
    };

    for (var i=0; i < qCollection.length; i++) {
      postQuestionObject.title = qCollection[i];

      Question.create(postQuestionObject, function (err, newQuestion) {
        req.body.questions.push(newQuestion._id);

        // console.log('i === qCollection.length', i);
        if (req.body.questions.length === qCollection.length) {
          /* CREATE DECK */
          Deck.create(req.body, function(err, deck) {
            console.log('deck created:', deck);
            if(err) { return handleError(res, err); }

            return res.json(201, deck);
          });

        }

      });
    }
  }



};

// Updates an existing deck in the DB.
exports.update = function(req, res) {
  // console.log('**** deck update params:', req.params);
  // console.log('**** deck update body:', req.params);

  if(req.body._id) { delete req.body._id; }
  Deck.findById(req.params.id, function (err, deck) {
    if (err) { return handleError(res, err); }
    if(!deck) { return res.send(404); }

    console.log('deck to update', deck);
    // if () -> deck.questions.push(secondQuestionId);

    var updated = _.merge(deck, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, deck);
    });
  });
};

// Deletes a deck from the DB.
exports.destroy = function(req, res) {
  Deck.findById(req.params.id, function (err, deck) {
    if(err) { return handleError(res, err); }
    if(!deck) { return res.send(404); }
    deck.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
