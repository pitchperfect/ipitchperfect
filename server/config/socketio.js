/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');
var currentAppUsers = {};

// When the user disconnects.. perform this
function onDisconnect(socket) {
}

// When the user connects.. perform this
function onConnect(socket) {
  // When the client emits 'info', this listens and executes
  socket.on('info', function (data) {
    console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
  });

  // Insert sockets below
  require('../api/review/review.socket').register(socket, currentAppUsers);
  require('../api/video/video.socket').register(socket);
  require('../api/userdeck/userdeck.socket').register(socket);
  require('../api/question/question.socket').register(socket);
  require('../api/response/response.socket').register(socket);
  require('../api/deck/deck.socket').register(socket);
  require('../api/thing/thing.socket').register(socket);
}

module.exports = function (socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  socketio.on('connection', function (socket) {
    socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.connectedAt = new Date();


    // register userId on common socket session object.
    socket.on('user connected', function (userId) {
      socket.userId = userId
      currentAppUsers[userId] = socket;
    })


    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socket);
      currentAppUsers[socket.userId] = null;
      console.info('[%s] DISCONNECTED', socket.address);
    });


    // Call onConnect.
    onConnect(socket);
    console.info('[%s] CONNECTED', socket.address);
  });
};
