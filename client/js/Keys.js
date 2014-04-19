/**************************************************
** GAME KEYBOARD CLASS
**************************************************/
function Keys(up, left, right, down) {
    this.up = up || false;
    this.left = left || false;
    this.right = right || false;
    this.down = down || false;
}
        
Keys.prototype.onKeyDown = function(e) {
    var c = e.keyCode;
    switch (c) {
        // Controls
        case 37: // Left
            this.left = true;
            break;
        case 38: // Up
            this.up = true;
            break;
        case 39: // Right
            this.right = true; // Will take priority over the left key
            break;
        case 40: // Down
            this.down = true;
            break;
    }
};
    
Keys.prototype.onKeyUp = function(e) {
    var c = e.keyCode;
    switch (c) {
        case 37: // Left
            this.left = false;
            break;
        case 38: // Up
            this.up = false;
            break;
        case 39: // Right
            this.right = false;
            break;
        case 40: // Down
            this.down = false;
            break;
    }
};

Keys.prototype.clearAllKeys = function() {
    this.up = false;
    this.left = false;
    this.right = false;
    this.down = false;
};
