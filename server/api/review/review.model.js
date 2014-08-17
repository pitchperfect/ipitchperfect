'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ReviewSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  responseId: {type: Schema.Types.ObjectId, ref: 'Response'},
  questionId: {type: Schema.Types.ObjectId, ref: 'Question'},
  videoId: {type: Schema.Types.ObjectId, ref: 'Video'},
  responseCreatorId: {type: Schema.Types.ObjectId, ref: 'User'},
  userDeckId:{type: Schema.Types.ObjectId, ref: 'Userdeck'},
  annotations: Array,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date}
});

ReviewSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  next();
});

module.exports = mongoose.model('Review', ReviewSchema);
