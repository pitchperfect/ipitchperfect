/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Review = require('./review.model');

exports.register = function(socket, connectUsers) {

  Review.schema.post('save', function (doc) {
    if (doc.completed) {
      onUpdate(connectUsers, socket, doc);
    } else {
      onSave(connectUsers, socket, doc);
    }
  });

  Review.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}


function onUpdate(connectUsers, socket, doc, cb) {
  console.log('updated review:', doc);
  if(connectUsers[doc.userId]) {
    console.log('emitting review update:', doc);
    connectUsers[doc.userId].emit('review:complete', doc);
  }
}

function onSave(connectUsers, socket, doc, cb) {
  if(connectUsers[doc.author]) {
    Review.populate(doc, {path:'userId', select: 'name'}, function(err, comment) {
      connectUsers[doc.author].emit('review:save', doc);
    });
  }
}

function onRemove(socket, doc, cb) {
  socket.emit('review:remove', doc);
}
