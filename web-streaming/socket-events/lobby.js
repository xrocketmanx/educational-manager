function Lobby() {
    let lastId = -1;
    let rooms = {};

    this.on = function(room, socket) {
        if (!rooms[room]) {
            rooms[room] = [];
        }
        rooms[room].push({
            socket,
            id: ++lastId
        });
        return lastId;
    };

    this.broadcast = function(sender, room, message) {
        if (rooms[room]) {
            let clients = rooms[room];
            for (let i = 0; i < clients.length; i++) {
                if (clients[i].socket !== sender) {
                    clients[i].socket.send(message);
                }
            }
        }
    };

    this.off = function(subscriptions) {
        for (let room in rooms) {
            let clients = rooms[room];
            for (let i = 0; i < clients.length; i++) {
                if (subscriptions.indexOf(clients[i].id) >= 0) {
                    clients.splice(i--, 1);
                }
            }
        }
    };
}

module.exports = Lobby;