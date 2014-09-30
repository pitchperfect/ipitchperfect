'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  deck: {type: Schema.Types.ObjectId, ref: 'Deck'},
  title: String,
  description: String,
  promptVideo: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date},
  active: Boolean,
});

QuestionSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  next();
});

module.exports = mongoose.model('Question', QuestionSchema);
