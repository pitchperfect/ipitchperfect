'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VideoSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Video', VideoSchema);
