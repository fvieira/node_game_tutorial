class Keys {
    up: boolean = false;
    left: boolean = false;
    right: boolean = false;
    down: boolean = false;
    
    onKeyDown(e):void {
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
                this.right = true;
                break;
            case 40: // Down
                this.down = true;
                break;
        }
    }
        
    onKeyUp(e): void {
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
    }

    clearAllKeys(): void {
        this.up = false;
        this.left = false;
        this.right = false;
        this.down = false;
    }
}
