const SocketEvents = require('./socket-events');

exports.startServer = function(server) {
    let socketEvents = new SocketEvents();
    socketEvents.open(server);

    console.log('ws server listening');
};