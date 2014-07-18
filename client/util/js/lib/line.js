/**
 * Created by a2014 on 14-7-17.
 */
function Line(o) {
    this.opt = o;
    this.data = o.data;
    this.label = o.label;
    this.x = o.label;
    this.w = o.width || 300;
    this.h = o.heiht || 400;
    this.init();
}

Line.prototype = {
    init: function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.w;
        canvas.height = this.h;
        document.body.appendChild(canvas);
        this.ctx = canvas.getContext('2d');

        this.drawBase();
        this.drawData();
    },
    drawBase: function () {
        this.drawCoordinate();
        this.drawLegend();

    },
    drawCoordinate: function () {
        this.drawX();
        this.drawY();
    },

    drawLegend: function () {
        var h = this.h,
            w = this.w,
            padding = 40,
            c = this.ctx;
        c.fillRect(w - padding * 2, 10, 10, 10);
        c.fillText('单位:元', w - padding * 2 + 15, 20);

    },
    drawX: function () {
        var h = this.h,
            w = this.w,
            padding = 40,
            c = this.ctx;

        c.beginPath();
        //画轴
        c.moveTo(padding, h - padding);
        c.lineTo(w, h - padding);

        //画箭头
        c.lineTo(w - padding * 0.125, h - padding * 1.125);
        c.moveTo(w, h - padding);
        c.lineTo(w - padding * 0.125, h - padding * 0.825);
        c.lineWidth = 2;
        c.strokeStyle = '#000';
        c.stroke();

        var pixPerses = 4;
        //画刻度
        var step = ( w - padding * 2) / this.label.length;
        this.label.forEach(function (l, index) {
            c.fillRect(step * index + padding, h - padding - 1.5, 1, 3);
            c.fillText(l, step * index + padding + 10, h - padding + 20, 20);
        })
    },
    drawY: function () {
        var h = this.h,
            w = this.w,
            padding = 40,
            c = this.ctx;

        //画坐标
        c.beginPath();
        c.moveTo(padding, h - padding);
        c.lineTo(padding, 0);

        //画箭头
        c.lineTo(padding * 0.825, padding * 0.125);
        c.moveTo(padding, 0);
        c.lineTo(padding * 1.125, padding * 0.125);
        c.lineWidth = 2;
        c.strokeStyle = '#000';
        c.stroke();

        //画刻度
        var max = this.data.sort(function (a, b) {
            return a < b ? 1 : -1;
        })[0];
        var min = this.data.reverse()[0];
        var num = Math.floor(max / this.data.length);
        var step = (h - padding * 4) / this.data.length;
        this.factor = step / num;
        for (var i = 0, len = this.data.length + 4; i <= len; i++) {
            c.fillRect(padding - 2.5, h - padding - step * i, 5, 5);
            c.fillText(num * i, padding - 20, h - padding - step * i, 20);
        }
    },
    drawData: function () {
        var h = this.h,
            w = this.w,
            padding = 40,
            c = this.ctx;
        var me = this;
        var XStep = ( w - padding * 2) / this.label.length;
        var YStep = (h - padding * 2) / this.data.length;
        var color = ['green', 'blue', 'red', 'pink', 'silver', 'black', 'origin'];
        c.beginPath();
        this.data.forEach(function (num, index) {
            c.fillStyle = color[Math.floor(Math.random() * 1000) % (color.length - 1)];
            var x = XStep * index + padding + YStep / 2, y = h - padding - num * me.factor;
            c.fillRect(x, y, 3, 3);
            c.lineTo(x, y);
            c.stroke();
            c.fillStyle = '#e43e34';
            c.font = "Bold 15px Arial";
            c.fillText(num, XStep * index + 3 + padding, h - padding - 20 - num * me.factor);
        })
    }
}