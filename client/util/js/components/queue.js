/**
 * Created by addison on 14-6-26.
 */
/**
 * Created by 宇乔 on 13-12-3.
 */

function isNumber(a) {
    return a && Object.prototype.toString.call(a) == '[object Number]';
}
function isFunction(a) {
    return a && Object.prototype.toString.call(a) == '[object Function]';
}

function animateY(el, distance, afterAnimation, seconds, type) {

    var s = el.style;
    if (!isNumber(seconds) || seconds == undefined) {
        seconds = 1;
    }
    type = type || 'cubic-bezier(0,1,0,1)';
    s.webkitTransition = '-webkit-transform ' + seconds + 's cubic-bezier(0,1,0,1)';
    s.webkitTransform = 'translate3d(0,' + distance + 'px,0)';

    var after = function () {
        if (isFunction(afterAnimation)) {
            afterAnimation();
        }
        el.removeEventListener("webkitTransitionEnd", after);
    }

    el.addEventListener("webkitTransitionEnd", after, false);
}
queue = {
    queue: [],
    queueBak: [],
    init: function () {
        window.requestAFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                // if all else fails, use setTimeout
                function (callback) {
                    return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
                };
        })();

        // handle multiple browsers for cancelAnimationFrame()
        window.cancelAFrame = (function () {
            return window.cancelAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.mozCancelAnimationFrame ||
                window.oCancelAnimationFrame ||
                function (id) {
                    window.clearTimeout(id);
                };
        })();
        this.id = 0;
        this.startime = 0;
        this.index = 0;
    },

    start: function (el) {
        this.init();
        this.el = el;
        var that = this;
        this.startime = new Date().getTime();
        this.run();
    },
    animate: function () {
        var me = queue;
        if (me.queue.length > 0) {
            var x = me.queue[0].x,
                y = me.queue[0].y,
                direction = me.queue[0].direction;
            me.queue.splice(0, 1);
            if (direction == 'y') {
                animateY(me.el, y);
            }
        }
    },
    run: function () {
        queue.animate();
        queue.id = window.requestAFrame(queue.run);
    },
    add: function (o) {
        queue.queue.push({
            x: o.x,
            y: o.y,
            direction: o.direction,
            timeStamp: o.timeStamp
        });

        queue.queueBak.push({
            x: o.x,
            y: o.y,
            direction: o.direction,
            timeStamp: o.timeStamp
        });
    },
    slowDown: function () {
        var q = queue;
        bak = q.queueBak;
        //  window.cancelAFrame(this.id);
        if (q.isStop()) {
            cancelAFrame(q.id);
        } else {
            var slowDownStamp = 1.5;
            queue.queueBak = [];
        }


        //    jex.queue.queueBak = [];
    },
    isStop: function () {
        var base = queue.queueBak;
        if (base.length < 2) {
            return true;
        }
        return Math.abs(base[base.length - 2].y - base[base.length - 1].y) < 3;
    }


}