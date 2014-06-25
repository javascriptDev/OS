/**
 * Created by a2014 on 14-6-24.
 */
function Ol(o) {
    this.itemTpl = o.tpl;
    this.data = o.data || [];
    this.opt = o;
    this.init();
}

Ol.prototype = {
    init: function () {
        var div = document.createElement('div');
        div.className = 'list-order';
        div.style.webkitTransform = 'translate3d(0,0,0)';
        div.innerHTML = '<div class="title">订单<div class="close">X</div></div><div class="ol-scroller"><div class="list-inner"></div></div><div class="ol-foot"><button class="submit">提交</button></div>'

        this.c = div.querySelector('.list-inner');
        this.el = div;
        this.title = div.querySelector('.title');
        this.subBtn = div.querySelector('.submit');
        this.close = div.querySelector('.close');

        this.addEvent();
        this.render();
        this.hide();
    },
    render: function () {
        this.c.innerHTML = template.compile(this.itemTpl)(this.data);
        document.body.appendChild(this.el);
        var scroll = new IScroll('.ol-scroller', {
            scrollY: true
        });
    },
    animate: function (el, distance) {
        var s = 'translate3d(0,' + distance + 'px,0) ';
        el.style.webkitTransform = s;
        el.style.mozTransform = s;
        el.style.transform = s;
    },
    addEvent: function () {
        var me = this;
        this.subBtn.onclick = function (e) {
            me.submit.call(me, e);
        }
        this.title.onclick = function () {
            me.show();
        }
        this.close.onclick = function (e) {
            e.stopPropagation();
            me.hide();
        }

    },
    show: function () {
        this.animate(this.el, 0)
    },
    reRender: function (data) {
        this.data.list.push(data);
        this.render();
    },
    hide: function () {
        this.animate(this.el, this.el.offsetHeight - 20);
    },
    submit: function (e) {
        this.opt.submit && this.opt.submit(this.data);
        this.data.list = [];
        this.c.innerHTML = '';
        this.hide();
    }
}