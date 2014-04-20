/// <reference path="Keys.ts" />
/// <reference path="Color.ts" />
/// <reference path="Player.ts" />
/// <reference path="socket.io-client.d.ts" />

interface IdToPlayerMap {
    [id: string]: Player;
}

class Game {

    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private keys: Keys;
    private localPlayer: Player;
    private remotePlayers: IdToPlayerMap;
    private socket: io.Socket;

    private init(): void {
        // Declare the canvas and rendering context
        this.canvas = <HTMLCanvasElement> document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");

        // Maximise the canvas
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Initialise keyboard controls
        this.keys = new Keys();

        // Calculate a random start position for the local player
        // The minus 5 (half a player size) stops the player being
        // placed right on the egde of the screen
        var startX = Math.round(Math.random() * (this.canvas.width - 6)),
            startY = Math.round(Math.random() * (this.canvas.height - 5));

        var r = Math.floor(Math.random() * 256),
            g = Math.floor(Math.random() * 256),
            b = Math.floor(Math.random() * 256);

        var color = new Color(r, g, b);

        // Initialise the local player
        this.localPlayer = new Player(undefined, startX, startY, color);
        this.remotePlayers = {};

        this.socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});

        // Start listening for events
        this.setEventHandlers();
    }

    /**************************************************
    ** GAME EVENT HANDLERS
    **************************************************/
    private setEventHandlers(): void {
        // Keyboard
        window.addEventListener("keydown", this.onKeydown.bind(this), false);
        window.addEventListener("keyup", this.onKeyup.bind(this), false);

        // Window resize
        window.addEventListener("resize", this.onResize.bind(this), false);

        // Window blur
        window.addEventListener("blur", this.onBlur.bind(this), false);

        this.socket.on("connect", this.onSocketConnected.bind(this));
        this.socket.on("disconnect", this.onSocketDisconnect.bind(this));
        this.socket.on("new player", this.onNewPlayer.bind(this));
        this.socket.on("move player", this.onMovePlayer.bind(this));
        this.socket.on("remove player", this.onRemovePlayer.bind(this));
    }

    // Keyboard key down
    private onKeydown(e): void {
        if (this.localPlayer) {
            this.keys.onKeyDown(e);
        }
    }

    // Keyboard key up
    private onKeyup(e): void {
        if (this.localPlayer) {
            this.keys.onKeyUp(e);
        }
    }

    // Browser window resize
    private onResize(e): void {
        // Maximise the canvas
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // Window blur
    private onBlur(e): void {
        if (this.localPlayer) {
            this.keys.clearAllKeys();
        }
    }

    private onSocketConnected(): void {
        console.log("Connected to socket server");
        this.socket.emit("new player", {x: this.localPlayer.x, y: this.localPlayer.y, color: this.localPlayer.color});
    }

    private onSocketDisconnect(): void {
        console.log("Disconnected from socket server");
    }

    private onNewPlayer(data): void {
        console.log("New player connected: " + JSON.stringify(data));
        var color = new Color(data.color.red, data.color.green, data.color.blue)
        var newPlayer = new Player(data.id, data.x, data.y, color);
        this.remotePlayers[newPlayer.id] = newPlayer;
    }

    private onMovePlayer(data): void {
        var remotePlayer = this.remotePlayers[data.id];
        remotePlayer.x = data.x;
        remotePlayer.y = data.y;
    }

    private onRemovePlayer(data): void {
        console.log("Player disconnected: " + data.id);
        delete this.remotePlayers[data.id];
    }

    /**************************************************
    ** GAME ANIMATION LOOP
    **************************************************/
    private animate(): void {
        var self = this;
        this.update();
        this.draw();

        // Request a new animation frame using Paul Irish's shim
        window.requestAnimationFrame(this.animate.bind(this));
    }


    /**************************************************
    ** GAME UPDATE
    **************************************************/
    private update(): void {
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
    }


    /**************************************************
    ** GAME DRAW
    **************************************************/
    private draw(): void {
        // Wipe the canvas clean
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the local player
        this.localPlayer.draw(this.ctx);

        // Draw the remote players
        var id: string;
        for (id in this.remotePlayers) {
            this.remotePlayers[id].draw(this.ctx);
        }
    }

    /**************************************************
    ** GAME START
    **************************************************/
    public start(): void {
        this.init();
        this.animate();
    }
}


