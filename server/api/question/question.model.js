'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  deck: {type: Schema.Types.ObjectId, ref: 'Deck'},
  title: String,
  description: String,
  promptVideo: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date},
  active: Boolean,
});

QuestionSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  next();
});

module.exports = mongoose.model('Question', QuestionSchema);
