/**
 * Created by addison on 14-7-17.
 */
function Histogram(o) {
    this.opt = o;
    this.data = o.data;
    this.label = o.label;
    this.x = o.label;
    this.w = o.width || 300;
    this.h = o.heiht || 400;
    this.init().render();
}

Histogram.prototype = {
    drawData: function () {
        var h = this.h,
            w = this.w,
            padding = 40,
            c = this.ctx;
        var me = this;
        var XStep = ( w - padding * 2) / this.label.length;
        var YStep = (h - padding * 2) / this.data.length;
        var color = ['green', 'blue', 'red', 'pink', 'silver', 'black', 'origin'];
        this.data.forEach(function (num, index) {
            c.fillStyle = color[Math.floor(Math.random() * 1000) % (color.length - 1)];
            c.fillRect(XStep * index + padding, h - padding, XStep, -num * me.factor);
            c.fillStyle = '#e43e34';
            c.font = "Bold 15px Arial";
            c.fillText(num, XStep * index + 10 + padding, h - padding - 20 - num * me.factor);
        })
    }
}

inherit(Histogram, Base)