'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserdeckSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  deckId: {type: Schema.Types.ObjectId, ref: 'Deck'},
  title: String,
  description: String,
  questions: [{type: Schema.Types.ObjectId, ref: 'Question'}],
  //response: [{type: Schema.Types.ObjectId, ref: 'Response'}],
  responses: { type: Schema.Types.Mixed, default: {'questionId':[]}},
  reviews: { type: Schema.Types.Mixed, default: {'responseId':[]}},
  questionsResponded: Schema.Types.Mixed,
  responsesReviewed: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date},
  active: Boolean
});

UserdeckSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  next();
});

module.exports = mongoose.model('Userdeck', UserdeckSchema);
