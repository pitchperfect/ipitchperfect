'use strict';

var _ = require('lodash');
var Review = require('./review.model');

// Get list of reviews by author
exports.index = function(req, res) {
  var author = req.user._id;
  Review.loadRecent(author, function (err, reviews) {
    if(err) { return handleError(res, err); }
    return res.json(200, reviews);
  });
};

// Get a single review
exports.show = function(req, res) {
  Review.findById(req.params.id, function (err, review) {
    if(err) { return handleError(res, err); }
    if(!review) { return res.send(404); }
    return res.json(review);
  });
};

exports.showForQuestionId = function(req, res) {
  var questionId = req.params.id;

  Review.find({questionId: questionId}, function(err, review) {
    console.log('err is ' + err);
    console.log('review is ' + review);

    if (err) {
      return handleError(res, err);
    }
    if (!review) {
      return res.send(404);
    }
    return res.json(review);
  });
};

// Creates a new review in the DB.
exports.create = function(req, res) {
  req.body.userId = req.user._id;

  var review = new Review(req.body);
  review.save(function(err, review) {
    if(err) { return handleError(res, err); }
    return res.json(201, review);
  });
  // Review.create(req.body, function(err, review) {
  //   if(err) { return handleError(res, err); }
  //     console.log('just created this review', review);
  //   return res.json(201, review);
  // });
};

// Updates an existing review in the DB.
exports.update = function(req, res) {
  var keysToUpdate = {};
  console.log('REQ BODY = ', req.body);

  if(req.body._id) { delete req.body._id; }

    console.log('ID COMING IN on request',req.params.id );
  Review.findById(req.params.id, function (err, review) {
    if (err) { return handleError(res, err); }
    if(!review) {
      console.log('DIDNT find review for param', req.params.id);
       return res.send(404);
       }
    //var updated = _.merge(review, req.body);
    // do this with update.


    var annotations = review.annotations.concat(req.body.annotations);
    console.log('annotations are ', annotations);

    review['annotations'] = annotations;
    review['questionId'] = req.body.questionId;
    review['userDeckId']= req.body.userDeckId;
    review['videoId'] = req.body.videoId;
    review['completed'] = true;

    console.log('keys to udpate are ', review);

    review.save(function(err, updatedReview) {
      console.log('review after update is ', updatedReview);
      // Would be nice to get an err status here
      return res.json(updatedReview);
    });
    // review.update({
    //   $set: keysToUpdate
    // }, function( ) {

      // console.log('review after update is ', review);
      // return res.json(review);
    // });

  });
};

// Deletes a review from the DB.
exports.destroy = function(req, res) {
  Review.findById(req.params.id, function (err, review) {
    if(err) { return handleError(res, err); }
    if(!review) { return res.send(404); }
    review.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
