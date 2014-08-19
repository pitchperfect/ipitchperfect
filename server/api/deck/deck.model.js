'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DeckSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  title: String,
  description: String,
  questions: [{type: Schema.Types.ObjectId, ref: 'Question'}],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date},
  active: Boolean
});

DeckSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  next();
});

module.exports = mongoose.model('Deck', DeckSchema);
