/**
 * Created by a2014 on 14-7-17.
 */
function Base(o) {
    this.opt = o;
    this.data = o.data;
    this.label = o.label;
    this.x = o.label;
    this.w = o.width || 300;
    this.h = o.heiht || 400;
}

Base.prototype = {
    init: function () {
        var me = this;
        this.el = msj.createEl('div', {
            className: 'chart-c'
        });
        this.opt.isQuery && (this.addQuery(), this.addEvent())
        this.addMain();
        return this;
    },
    addMain: function () {
        var me = this;
        this.main = msj.createEl('canvas', {
            width: me.w,
            height: me.h
        })

        this.el.appendChild(this.main);
        this.ctx = this.main.getContext('2d');
        this.drawBase();
        this.drawData();
    },
    render: function () {
        document.body.querySelector(this.opt.container).appendChild(this.el);
    },
    addQuery: function () {
        this.beginTime = msj.createEl('div', {
            className: 'begin-time',
            innerHTML: '<label>开始时间</label><input type="date" class="begin-time-val">'
        })

        this.endTime = msj.createEl('div', {
            className: 'end-time',
            innerHTML: '<label>结束时间</label><input type="date" class="end-time-val">'
        })

        this.type = msj.createEl('select', {
            className: 'query-type',
            innerHTML: '<option value="year">年</option><option value="month">月</option><option value="day" selected="selected">日</option>'
        })

        this.query = msj.createEl('button', {
            innerHTML: '查询',
            className: 'query-btn'
        })

        this.queryEl = msj.createEl('div', {
            className: 'chart-query'
        })
        this.queryEl.appendChild(this.beginTime);
        this.queryEl.appendChild(this.endTime);
        this.queryEl.appendChild(this.type);
        this.queryEl.appendChild(this.query);
        this.el.appendChild(this.queryEl);
    },
    addEvent: function () {
        var me = this;
        this.query.onclick = function () {
            me.reDraw(me.queryData());
        }
    },
    queryData: function () {
        var me = this;
        var type = me.type.options[me.type.selectedIndex].value;
        var bt = this.beginTime.value,
            et = this.endTime.value;
        switch (type) {
            case 'year':

                break;
            case 'month':
                ;
                break;
            case 'day':

                ;
                break;
            default:
                return;
                break;
        }
        this.label = [];
        this.data = [];
    },
    drawBase: function () {
        this.drawCoordinate();
        this.drawLegend();
    },
    drawCoordinate: function () {
        this.ctx.fillStyle = '#000';
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
    hide: function () {
        this.el.style.display = 'none';
    },
    show: function () {
        this.el.style.display = 'block';
    },
    reDraw: function (data, isReset) {
        isReset && (this.data = data);
        !isReset && (this.data = this.data.concat(data));
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.drawBase();
        this.drawData();
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