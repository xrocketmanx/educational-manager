function PubSub() {
    let events = {};
    this.on = function(eventType, callback) {
        if (!events[eventType]) {
            events[eventType] = [];
        }
        events[eventType].push(callback);
    };

    this.emit = function(eventType, ...args) {
        for (let callback of events[eventType]) {
            callback(...args);
        }
    };
}

//TODO: Reconnect ability
function SocketEvents() {
    this._rooms = {};
    this._callbacks = [];
}

SocketEvents.prototype.open = function(url, callback) {
    if (this._opened) {
        callback();
        return;
    }
    this._callbacks.push(callback);
    this._socket = new WebSocket(url);

    this._socket.onopen = () => {
        this._opened = true;
        this._callbacks.forEach(callback => {
            callback();
        });
    };

    let forwardEvent;

    this._socket.onmessage = ev => {
        let message = ev.data;
        if (forwardEvent) {
            let room = this._rooms[forwardEvent];
            for (let handler of room) {
                handler(message);
            }
            forwardEvent = null;
        } else if (typeof message === 'string') {
            let data = JSON.parse(message);
            if (data.forwardEvent) {
                forwardEvent = data.forwardEvent;
            } else {
                let room = this._rooms[data.room];
                for (let handler of room) {
                    handler(data.message);
                }
            }
        }
    };
};

SocketEvents.prototype.close = function() {
    if (this._socket) {
        this._opened = false;
        this._socket.close();
        this._rooms = {};
    }
};

SocketEvents.prototype.setBinaryType = function(type) {
    this._socket.binaryType = type;
};

SocketEvents.prototype.on = function(room, callback) {
    if (!this._rooms[room]) {
        this._socket.send(JSON.stringify({subscribe: true, room}));
        this._rooms[room] = [];
    }
    this._rooms[room].push(callback);
};

SocketEvents.prototype.send = function(room, message) {
    let data = {room, message};
    this._socket.send(JSON.stringify(data));
};

SocketEvents.prototype.sendBinary = function(room, message) {
    this._socket.send(JSON.stringify({forwardEvent: room}));
    this._socket.send(message);
};

