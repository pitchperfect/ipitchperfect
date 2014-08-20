'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ResponseSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  questionId: {type: Schema.Types.ObjectId, ref: 'Question'},
  videoId: {type: Schema.Types.ObjectId, ref: 'Video'},
  userDeckId: {type: Schema.Types.ObjectId, ref: 'Userdeck'},
  questionTitle: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date},
  active: Boolean
});

ResponseSchema.pre('save', function(next) {
  var now = new Date();
  this.updatedAt = now;
  next();
});

module.exports = mongoose.model('Response', ResponseSchema);
