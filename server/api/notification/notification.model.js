'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NotificationSchema = new Schema({
  author: {type: Schema.Types.ObjectId, ref: 'User'},
  receiver: {type: Schema.Types.ObjectId, ref: 'User'},
  response: String, //{type: Schema.Types.ObjectId, ref: 'Response'},
  title: String,
  description: String,
  created_at: { type: Date, default: Date.now },
  active: Boolean
});

NotificationSchema.statics = {
  loadRecent: function(cb) {
    this.find({}) //userId
      .populate({path:'author', select: 'name'})
      .sort('-date')
      // .limit(20)
      .exec(cb);
  }
};

module.exports = mongoose.model('Notification', NotificationSchema);
