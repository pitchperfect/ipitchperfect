/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Notification = require('./notification.model');

exports.register = function(socket) {
  Notification.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Notification.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {

  Notification.populate(doc, {path:'author', select: 'name'}, function(err, notification) {
    socket.emit('notification:save', notification);
  });
  // socket.emit('notification:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('notification:remove', doc);
}
