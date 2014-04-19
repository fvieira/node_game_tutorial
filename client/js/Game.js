/**************************************************
** GAME CLASS
**************************************************/
function Game() {
    this.canvas = undefined;
    this.ctx = undefined;
    this.keys = undefined;
    this.localPlayer = undefined;
    this.remotePlayers = {};
    this.socket = undefined;
}

/**************************************************
** GAME INIT
**************************************************/
Game.prototype.init = function() {
    // Declare the canvas and rendering context
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    // Maximise the canvas
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Initialise keyboard controls
    this.keys = new Keys();

    // Calculate a random start position for the local player
    // The minus 5 (half a player size) stops the player being
    // placed right on the egde of the screen
    var startX = Math.round(Math.random()*(this.canvas.width-5)),
        startY = Math.round(Math.random()*(this.canvas.height-5));

    // Initialise the local player
    this.localPlayer = new Player(undefined, startX, startY);

    this.socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});

    // Start listening for events
    this.setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
Game.prototype.setEventHandlers = function() {
    // Keyboard
    window.addEventListener("keydown", this.onKeydown.bind(this), false);
    window.addEventListener("keyup", this.onKeyup.bind(this), false);

    // Window resize
    window.addEventListener("resize", this.onResize.bind(this), false);

    this.socket.on("connect", this.onSocketConnected.bind(this));
    this.socket.on("disconnect", this.onSocketDisconnect.bind(this));
    this.socket.on("new player", this.onNewPlayer.bind(this));
    this.socket.on("move player", this.onMovePlayer.bind(this));
    this.socket.on("remove player", this.onRemovePlayer.bind(this));
};

// Keyboard key down
Game.prototype.onKeydown = function(e) {
    if (this.localPlayer) {
        this.keys.onKeyDown(e);
    }
};

// Keyboard key up
Game.prototype.onKeyup = function(e) {
    if (this.localPlayer) {
        this.keys.onKeyUp(e);
    }
};

// Browser window resize
Game.prototype.onResize = function(e) {
    // Maximise the canvas
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
};

Game.prototype.onSocketConnected = function() {
    console.log("Connected to socket server");
    this.socket.emit("new player", {x: this.localPlayer.x, y: this.localPlayer.y});
};

Game.prototype.onSocketDisconnect = function() {
    console.log("Disconnected from socket server");
};

Game.prototype.onNewPlayer = function(data) {
    console.log("New player connected: " + data.id);
    var newPlayer = new Player(data.id, data.x, data.y);
    this.remotePlayers[newPlayer.id] = newPlayer;
};

Game.prototype.onMovePlayer = function(data) {
    var remotePlayer = this.remotePlayers[data.id];
    remotePlayer.x = data.x;
    remotePlayer.y = data.y;
};

Game.prototype.onRemovePlayer = function(data) {
    console.log("Player disconnected: " + data.id);
    delete this.remotePlayers[data.id];
};


/**************************************************
** GAME ANIMATION LOOP
**************************************************/
Game.prototype.animate = function() {
    var self = this;
    this.update();
    this.draw();

    // Request a new animation frame using Paul Irish's shim
    window.requestAnimationFrame(this.animate.bind(this));
};


/**************************************************
** GAME UPDATE
**************************************************/
Game.prototype.update = function() {
    var oldX, oldY, newX, newY, dx, dy;
    oldX = this.localPlayer.x; 
    oldY = this.localPlayer.y; 
    this.localPlayer.update(this.keys);
    newX = this.localPlayer.x; 
    newY = this.localPlayer.y; 
    dx = newX - oldX;
    dy = newY - oldY;
    if (dx !== 0 || dy !== 0) {
        this.socket.emit("move player", {dx: dx, dy: dy});
    }
};


/**************************************************
** GAME DRAW
**************************************************/
Game.prototype.draw = function() {
    // Wipe the canvas clean
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the local player
    this.localPlayer.draw(this.ctx);

    // Draw the remote players
    var id;
    for (id in this.remotePlayers) {
        this.remotePlayers[id].draw(this.ctx);
    }
};

/**************************************************
** GAME START
**************************************************/
Game.prototype.start = function() {
    this.init();
    this.animate();
};
