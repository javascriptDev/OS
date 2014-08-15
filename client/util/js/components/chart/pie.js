/**
 * Created by a2014 on 14-7-17.
 */
function pie(o) {
    this.opt = o;
    this.data = o.data;
    this.w = o.width || 300;
    this.h = o.heiht || 400;
    this.init();
}

pie.prototype = {
    init: function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.w;
        canvas.height = this.h;

        this.ctx = canvas.getContext('2d');
        this.ctx.font = "Bolder 20px Arial";
        this.render();
    },
    render: function () {
        var c = this.ctx;
        var me = this;
        var cc = {
            x: this.w / 2,
            y: this.h / 2
        };
        var radius = this.w > this.h ? this.h / 2 : this.w / 2;

        var sum = 0;
        this.data.forEach(function (item, index) {
            sum += item;

        })
        this.sum = sum;

        this.data.forEach(function (item, index) {
            c.fillStyle = randomColor();
            c.beginPath();
            var begin = me.getBeginAngle(index);
            var end = me.getEndAngle(index);
            console.log(begin);
            c.arc(cc.x, cc.y, radius, 2 * Math.PI * begin, 2 * Math.PI * end, false);
            c.lineTo(cc.x, cc.y);
            c.closePath();
            c.fill();
        })
        this.data.forEach(function (item, index) {
            c.fillText(item, 50 + 40 * index, radius);
        })

    },
    getBeginAngle: function (index) {
        var begin = 0;
        this.data.forEach(function (item, i) {
            if (i < index) {
                begin += item;
            }
        });
        return begin / this.sum;
    },
    getEndAngle: function (index) {
        var end = 0;
        this.data.forEach(function (item, i) {
            if (i <= index) {
                end += item;
            }
        });
        return end / this.sum;
    }

}



