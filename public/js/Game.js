/**************************************************
** GAME CLASS
**************************************************/
function Game() {
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
    this.localPlayer = new Player(startX, startY);

    // Start listening for events
    this.setEventHandlers();
}


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
Game.prototype.setEventHandlers = function() {
    var self = this;

    // Keyboard
    window.addEventListener("keydown", function (e) {self.onKeydown(e);}, false);
    window.addEventListener("keyup", function (e) {self.onKeyup(e);}, false);

    // Window resize
    window.addEventListener("resize", function (e) {self.onResize(e);}, false);
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


/**************************************************
** GAME ANIMATION LOOP
**************************************************/
Game.prototype.animate = function() {
    var self = this;
    this.update();
    this.draw();

    // Request a new animation frame using Paul Irish's shim
    window.requestAnimationFrame(function () {self.animate();});
};


/**************************************************
** GAME UPDATE
**************************************************/
Game.prototype.update = function() {
    this.localPlayer.update(this.keys);
};


/**************************************************
** GAME DRAW
**************************************************/
Game.prototype.draw = function() {
    // Wipe the canvas clean
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw the local player
    this.localPlayer.draw(this.ctx);
};

/**************************************************
** GAME START
**************************************************/
Game.prototype.start = function() {
    this.animate();
};
