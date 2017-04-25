var app = require('../app');
var socketServer = require('../web-streaming');

var PORT = process.env['PORT'] || 3000;

var server = app.listen(PORT, function() {
    console.log('listening on ' + PORT);

    socketServer.startServer(server);
});