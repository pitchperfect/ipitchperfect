/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Response = require('./response.model');

exports.register = function(socket) {
  Response.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Response.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('response:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('response:remove', doc);
}