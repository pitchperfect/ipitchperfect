'use strict';

var _ = require('lodash');
var Response = require('./response.model');
var UserDeck = require('../userdeck/userdeck.model');
var UserDeckController = require('../userdeck/userdeck.controller');
// var User = require('../user/user.model');
// var Deck = require('../deck/deck.model');
// var Question = require('../question/question.model');

// Get list of responses
exports.index = function(req, res) {
  Response.find(function (err, responses) {
    if(err) { return handleError(res, err); }
    return res.json(200, responses);
  });
};


// Get a specific response
// exports.getSpecificResponse = function(req, res) {
//   Response.findById(req.params.id, function (err, response) {
//     if(err) { return handleError(res, err); }
//     if(!response) { return res.send(404); }
//     return res.json(response);
//   });
// };

// Get a single response
exports.show = function(req, res) {
  console.log('server - response id is ' + req.params.id);

  Response.findById(req.params.id, function (err, response) {
    if(err) { return handleError(res, err); }
    if(!response) { return res.send(404); }
      console.log('server - got response ', response);
    return res.json(response);
  });
};

// Creates a new response in the DB.
exports.create = function(req, res) {

  req.body.userId = req.user._id;

  Response.create(req.body, function(err, response) {
    if(err) { return handleError(res, err); }
    console.log('from Response post ', response);

    return res.json(201, response);

  });
};

// Updates an existing response in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Response.findById(req.params.id, function (err, response) {
    if (err) { return handleError(res, err); }
    if(!response) { return res.send(404); }
    var updated = _.merge(response, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, response);
    });
  });
};

// Deletes a response from the DB.
exports.destroy = function(req, res) {
  Response.findById(req.params.id, function (err, response) {
    if(err) { return handleError(res, err); }
    if(!response) { return res.send(404); }
    response.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
