var Keys = (function () {
    function Keys() {
        this.up = false;
        this.left = false;
        this.right = false;
        this.down = false;
    }
    Keys.prototype.onKeyDown = function (e) {
        var c = e.keyCode;
        switch (c) {
            case 37:
                this.left = true;
                break;
            case 38:
                this.up = true;
                break;
            case 39:
                this.right = true;
                break;
            case 40:
                this.down = true;
                break;
        }
    };

    Keys.prototype.onKeyUp = function (e) {
        var c = e.keyCode;
        switch (c) {
            case 37:
                this.left = false;
                break;
            case 38:
                this.up = false;
                break;
            case 39:
                this.right = false;
                break;
            case 40:
                this.down = false;
                break;
        }
    };

    Keys.prototype.clearAllKeys = function () {
        this.up = false;
        this.left = false;
        this.right = false;
        this.down = false;
    };
    return Keys;
})();
//# sourceMappingURL=Keys.js.map
