'use strict';

var _ = require('lodash');
var Question = require('./question.model');
var Deck = require('../deck/deck.model');
// var User = require('../user/user.model');
// var Response = require('../response/response.model');

// Get list of questions
exports.index = function(req, res) {
  Question.find(function (err, questions) {
    if(err) { return handleError(res, err); }
    return res.json(200, questions);
  });
};

// Get a single question
exports.show = function(req, res) {
  Question.findById(req.params.id, function (err, question) {
    if(err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    return res.json(question);
  });
};

// Creates a new question in the DB.
exports.create = function(req, res) {
  // requires: { userId: userId, deck: deckId, title: "....?", description: "...", promptVideo: "video prompt ref", active: true }
  Question.create(req.body, function(err, question) {
    if(err) { return handleError(res, err); }

    /** UPDATE DECK ASSOCIATED to this question by inserting a reference to itself **/
    var questionId = question._id;
    var deckId = question.deckId;
    Deck.findById(deckId, function (err, deck) {
      deck.questions.push(questionId);
      deck.save();
    });


    return res.json(201, question);
  });
};

// Updates an existing question in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Question.findById(req.params.id, function (err, question) {
    if (err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    var updated = _.merge(question, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, question);
    });
  });
};

// Deletes a question from the DB.
exports.destroy = function(req, res) {
  Question.findById(req.params.id, function (err, question) {
    if(err) { return handleError(res, err); }
    if(!question) { return res.send(404); }
    question.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
