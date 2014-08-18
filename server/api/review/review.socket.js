/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Review = require('./review.model');

exports.register = function(socket, connectUsers) {
  Review.schema.post('save', function (doc) {
    onSave(connectUsers, socket, doc);
  });
  Review.schema.post('remove', function (doc) {
    onRemove(socket, doc); //integrate: connectUsers
  });
}

function onSave(connectUsers, socket, doc, cb) {
  // console.log('review1 in pipe', Review);
  //console.log('connect obj in pipe', connectUsers);

  console.log('doc in pipe', doc);
  console.log('boolean in pipe', connectUsers[doc.author]);
  if(connectUsers[doc.author]){
    Review.populate(doc, {path:'userId', select: 'name'}, function(err, comment) {
      connectUsers[doc.author].emit('review:save', doc);
    });
  }
}

function onRemove(socket, doc, cb) {
  socket.emit('review:remove', doc);
}
