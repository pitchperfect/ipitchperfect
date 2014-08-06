'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ResponseSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  deckId: {type: Schema.Types.ObjectId, ref: 'Deck'},
  questionId: {type: Schema.Types.ObjectId, ref: 'Question'},
  questionTitle: String,
  description: String,
  video: String,
  textVideo: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date},
  active: Boolean
});

ResponseSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  next();
});

module.exports = mongoose.model('Response', ResponseSchema);
