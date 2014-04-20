/// <reference path="Color.ts" />
/// <reference path="Keys.ts" />

class Player {
    static moveAmount: number = 2;
    
    constructor(public id: string, public x: number, public y:number, public color: Color) {}

    update(keys: Keys): void {
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
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color.getAsRGB();
        ctx.fillRect(this.x - 5, this.y - 5, 10, 10);
    }
}


