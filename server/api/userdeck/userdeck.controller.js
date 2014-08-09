'use strict';

var _ = require('lodash');
var Userdeck = require('./userdeck.model');

// Get list of userdecks
exports.index = function(req, res) {
  Userdeck.find(function (err, userdecks) {
    if(err) { return handleError(res, err); }
    return res.json(200, userdecks);
  });
};

// Get a single userdeck
exports.show = function(req, res) {
  Userdeck.findById(req.params.id, function (err, userdeck) {
    if(err) { return handleError(res, err); }
    if(!userdeck) { return res.send(404); }
    return res.json(userdeck);
  });
};

// Creates a new userdeck in the DB.
exports.create = function(req, res) {
  // requires: {userId: userId, deck: deckId, questionsResponded: {}, responsesReviewed: {}, active: true};
  // after object is created, requires: questionId, responseId
  Userdeck.create(req.body, function(err, userdeck) {
    if(err) { return handleError(res, err); }

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
  if(req.body._id) { delete req.body._id; }
  Userdeck.findById(req.params.id, function (err, userdeck) {
    if (err) { return handleError(res, err); }
    if(!userdeck) { return res.send(404); }
    var updated = _.merge(userdeck, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, userdeck);
    });
  });
};

// Deletes a userdeck from the DB.
exports.destroy = function(req, res) {
  Userdeck.findById(req.params.id, function (err, userdeck) {
    if(err) { return handleError(res, err); }
    if(!userdeck) { return res.send(404); }
    userdeck.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
