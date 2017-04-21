var app = require('../app');
var socketServer = require('../web-streaming');

var PORT = process.env['PORT'] || 3000;
var SOCKET_PORT = 8080;

app.listen(PORT, function() {
    console.log('listening on ' + PORT);
});

socketServer.startServer(SOCKET_PORT);