'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserdeckSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  deckId: {type: Schema.Types.ObjectId, ref: 'Deck'},
  questionsResponded: Schema.Types.Mixed,
  responsesReviewed: Schema.Types.Mixed,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date},
  active: Boolean
});

UserdeckSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  next();
});




module.exports = mongoose.model('Userdeck', UserdeckSchema);
