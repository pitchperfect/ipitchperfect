'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ReviewSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User'},            // who requested
  responseId: {type: Schema.Types.ObjectId, ref: 'Response'},    // what to be reviewed
  // questionId: {type: Schema.Types.ObjectId, ref: 'Question'},
  // videoId: {type: Schema.Types.ObjectId, ref: 'Video'},
  author: {type: Schema.Types.ObjectId, ref: 'User'}, // whom invited to review
  // userDeckId:{type: Schema.Types.ObjectId, ref: 'Userdeck'},
  completed: Boolean,                                             // Task completed ?
  annotations: Array,                                            // when task completed.
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date}
});

ReviewSchema.pre('save', function(next) {
  var now = new Date();
  this.updated_at = now;
  next();
});

ReviewSchema.statics = {
  loadRecent: function(author, cb) {
    this.find({author: author})
      .populate({path:'userId', select: 'name'})
      // .sort('-created_at')
      // .limit(20)
      .exec(cb);
  }
};

module.exports = mongoose.model('Review', ReviewSchema);
