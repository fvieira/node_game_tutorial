/// <reference path="Color.ts" />
/// <reference path="Keys.ts" />
var Player = (function () {
    function Player(id, x, y, color) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = color;
    }
    Player.prototype.update = function (keys) {
        // Up key takes priority over down
        if (keys.up) {
            this.y -= Player.moveAmount;
        } else if (keys.down) {
            this.y += Player.moveAmount;
        }

        // Left key takes priority over right
        if (keys.left) {
            this.x -= Player.moveAmount;
        } else if (keys.right) {
            this.x += Player.moveAmount;
        }
    };

    Player.prototype.draw = function (ctx) {
        ctx.fillStyle = this.color.getAsRGB();
        ctx.fillRect(this.x - 5, this.y - 5, 10, 10);
    };
    Player.moveAmount = 2;
    return Player;
})();
//# sourceMappingURL=Player.js.map
