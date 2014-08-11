/**
 * Created by addison on 14-6-24.
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
        div.innerHTML = '<div class="title">订单<div class="close">X</div></div><div class="desk-number">桌号:<input type="number" class="d-n"> <div class="ol-scroller"><div class="list-inner"></div></div><div class="ol-foot"><button class="submit">提交</button></div>'

        this.c = div.querySelector('.list-inner');
        this.scrollC = div.querySelector('.ol-scroller');
        this.el = div
        this.classCollection = {
            title: 'title',
            submit: 'submit',
            close: 'close',
            addOne: 'add-one',
            subtractOne: 'subtract-one'

        }
        this.deskNumber = div.querySelector('.d-n');
        this.addEvent()
        this.render();
        this.hide();
    },
    render: function () {
        this.c.innerHTML = template.compile(this.itemTpl)(this.data);
        document.body.appendChild(this.el);
    },
    animate: function (el, distance) {
        var s = 'translate3d(0,' + distance + 'px,0) ';
        el.style.webkitTransform = s;
        el.style.mozTransform = s;
        el.style.transform = s;
    },
    addScroll: function () {
        var me = this;
        addScrollEvent(this.c, {
            tap: {
                item: me.c,
                fn: function (e) {
                    if (e.target.className == 'ol-del') {
                        me.data.list.forEach(function (item, index) {
                            if (item.id == e.target.dataset['id']) {
                                me.data.list.splice(index, 1);
                            }
                        })
                        me.render();
                    }
                }
            }
        });
    },
    subtractOneEvent: function (text) {
        var me = this;
        this.data.list.forEach(function (item, index) {
            if (item.text == text) {
                if (item.count > 1) {
                    item.count--;
                    item.sum = item.value * item.count;
                    me.render();
                } else {
                    me.data.list.splice(index, 1);
                    me.render();
                    return;
                }
            }
        })
    },
    addOneEvent: function (text) {
        this.data.list.forEach(function (item) {
            if (item.text == text) {
                item.count++;
                item.sum = item.value * item.count;
            }
        })
        this.render();
    },
    addEvent: function () {
        var me = this;
        this.el.addEventListener('touchstart', function (e) {
            var target = e.touches[0].target,
                className = target.className;
            var cc = me.classCollection;
            switch (className) {
                case cc.addOne:
                    var text = target.parentNode.firstChild.innerText;
                    me.addOneEvent(text);
                    break;
                case cc.subtractOne:
                    var text = target.parentNode.firstChild.innerText;
                    me.subtractOneEvent(text);
                    break;
                case cc.close:
                    e.stopPropagation();
                    me.hide();
                    break;
                case cc.submit:
                    me.submit.call(me, e);
                    break;
                case cc.title:
                    me.show();
                    break;
                default:
                    return;
                    break
            }
        })
    },
    show: function () {
        this.animate(this.el, 0)
    },
    reRender: function (data) {
        this.data.list.push(data);
        this.render();
    },
    hide: function () {
        this.animate(this.el, this.el.offsetHeight - 40);
    },
    submit: function (e) {
        var me = this;
        var date = new Date().getTime();

        this.opt.submit && this.opt.submit({
            data: me.data,
            dn: me.deskNumber.value || 0,
            statues: 'begin',
            date: date
        });


        this.data.list = [];
        this.c.innerHTML = '';
        this.deskNumber.value = '';
        this.hide();
    }
}