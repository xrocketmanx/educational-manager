const WebSocketServer = require('ws');
const Lobby = require('./lobby');

function SocketEvents() {
    this._lobby = new Lobby();
}

SocketEvents.prototype.open = function(server) {
    this._server = new WebSocketServer.Server({server});

    this._server.on('connection', client => {
        let subscriptions = [];
        let forwardEvent;

        client.on('message', message => {
            if (forwardEvent) {
                this._lobby.broadcast(client, forwardEvent, JSON.stringify({forwardEvent}));
                this._lobby.broadcast(client, forwardEvent, message);
                forwardEvent = null;
            } else if (typeof message === 'string') {
                let data = JSON.parse(message);
                if (data.subscribe) {
                    let subId = this._lobby.on(data.room, client);
                    subscriptions.push(subId);
                } else if (data.forwardEvent) {
                    forwardEvent = data.forwardEvent;
                } else {
                    this._lobby.broadcast(client, data.room, message);
                }
            }
        });

        client.on('close', () => {
            this._lobby.off(subscriptions);
        });
    });
};

module.exports = SocketEvents;
