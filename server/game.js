var util = require("util"),
    io = require("socket.io"),
    Player = require("./Player").Player;

var socket,
    players;

function init() {
    players = {};
    socket = io.listen(8000);
    socket.configure(function() {
        socket.set("transports", ["websocket"]);
        socket.set("log level", 2);
    });
    setEventHandlers();
}

function setEventHandlers() {
    socket.sockets.on("connection", onSocketConnection);
}

function onSocketConnection(client) {
    util.log(util.format("Player has connected: %s", client.id));
    client.on("disconnect", onClientDisconnect);
    client.on("new player", onNewPlayer);
    client.on("move player", onMovePlayer);
}

function onClientDisconnect() {
    util.log(util.format("Player has disconnected: %s", this.id));
    delete players[this.id];
    this.broadcast.emit("remove player", {id: this.id});
}

function onNewPlayer(data) {
    util.log(util.format("New player: %s -> %j", this.id, data));
    var newPlayer = new Player(this.id, data.x, data.y, data.color);
    this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.x, y: newPlayer.y, color: newPlayer.color});
    var id;
    for (id in players) {
        this.emit("new player", {id: id, x: players[id].x, y: players[id].y, color: players[id].color});
    }
    players[newPlayer.id] = newPlayer;
}

function onMovePlayer(data) {
    util.log(util.format("Player moved: %s -> %j", this.id, data));
    var thisPlayer = players[this.id];
    if (thisPlayer) {
        thisPlayer.x += data.dx;
        thisPlayer.y += data.dy;
    }
    this.broadcast.emit("move player", {id: this.id, x: thisPlayer.x, y: thisPlayer.y});
}

init();
