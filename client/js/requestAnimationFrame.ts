(function () {
    var lastTime: number = 0;
    var vendors: string[] = ['webkit', 'moz'];
    for (var x: number = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback: FrameRequestCallback): number {
            var currTime: number = new Date().getTime();
            var timeToCall: number = Math.max(0, 16 - (currTime - lastTime));
            var id: number = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id): void {
            clearTimeout(id);
        };
    }
}());
