const SocketEvents = require('./socket-events');

exports.startServer = function(port) {
    let socketEvents = new SocketEvents();
    socketEvents.open(port);

    console.log('ws server listening on ' + port);
};