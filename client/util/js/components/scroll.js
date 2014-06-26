/**
 * Created by a2014 on 14-6-26.
 */
function addScrollEvent(el, o) {

    var isMove = false;
    var that = this;
    var sx, sy;
    var beginY = 0;
    var state = '';

    var tap = o.tap,
        tapEl,
        tapFn = tap.fn;
    var bt, et;
    var outValue = 10;

    el.addEventListener('touchstart', function (e) {
        sx = e.touches[0].pageX;
        sy = e.touches[0].pageY;
        var y = parseInt(el.style.webkitTransform.split(',')[1]);

        if (!isNaN(y)) {
            beginY = y;
        } else {
            beginY = 0;
        }
        bt = new Date().getTime();
        queue.add({x: 0, y: beginY, direction: 'y', timeStamp: bt});
        queue.start(el);

    }, false);

    el.addEventListener('touchmove', function (e) {
        isMove = true;
        e.preventDefault();
        e.stopPropagation();
        var moveY = 0;
        if (isMove) {
            var x = e.touches[0].pageX,
                y = e.touches[0].pageY;

            //判断上边界超出
            if (parseInt(el.style.webkitTransform.split(',')[1]) > 0) {
                state = 'up';
                moveY = beginY + (y - sy);

            } else if ((Math.abs(beginY) - (e.touches[0].pageY - sy)) - (queue.el.offsetHeight - el.parentNode.offsetHeight ) > 5) {
                //  moveY = -(queue.el.offsetHeight - el.parentNode.offsetHeight.offsetHeight);
                state = 'down'
                moveY = beginY + (y - sy)

            } else {
                moveY = beginY + (y - sy);
            }
            queue.add({x: 0, y: moveY, direction: 'y', timeStamp: new Date().getTime()});
        }
    }, false);

    el.addEventListener('touchend', function (e) {

        outValue = 10;
        var et = new Date().getTime();
        isMove = false;
        var moveY;
        if (state != '') {
            if (state == 'up') {
                moveY = 0;
            } else {
                moveY = -(queue.el.offsetHeight - el.parentNode.offsetHeight);
            }
            queue.add({x: 0, y: moveY, direction: 'y', timeStamp: et });
            state = '';
        }
        //console.dir(queue.queueBak);
        queue.slowDown();

        if (et - bt < 80) {
            tapFn(e);
        }
    }, false);
}