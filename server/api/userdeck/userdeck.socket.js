/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Userdeck = require('./userdeck.model');

exports.register = function(socket) {
  Userdeck.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Userdeck.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('userdeck:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('userdeck:remove', doc);
}