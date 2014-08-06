'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DeckSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  title: String,
  description: String,
  questions: [{type: Schema.Types.ObjectId, ref: 'Question'}],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date},
  active: Boolean
});

DeckSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  next();
});

module.exports = mongoose.model('Deck', DeckSchema);
