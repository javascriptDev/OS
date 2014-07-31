/**
 * Created by a2014 on 14-7-28.
 */
function popup(opt) {
    this.opt = opt;
    this.rendered = false;
    var _data = opt.data || [];
    this.addData = function (data) {
        _data = data;
    }
    this.getData = function () {
        return _data;
    }
    this.setData = function (data) {
        _data = data;
    }
    this.init();


}


popup.prototype = {
    init: function () {
        var me = this;
        var opt = this.opt;
        this.c = msj.createEl('div', {
            className: 'addison-popup',
            style: {
                height: '100%',
                width: '100%',
                position: 'absolute',
                background: 'rgba(205,197,191,0.8)',
                top: 0
            }
        });
        this.el = msj.createEl('div', {
                className: 'popup-body',
                style: {
                    width: opt.width || '400px',
                    height: opt.height || '500px',
                    margin: '40px auto',
                    background: 'white'
                }
            }
        )
        this.c.appendChild(this.el);
        if (this.opt.isRender) {
            this.render();
        }

    },
    render: function () {
        var me = this;
        this.el.innerHTML = template.compile(this.opt.tpl)(this.getData());
        me.addButton();
        !this.rendered && (function () {
            document.body.appendChild(me.c);
            me.rendered = true;
        }())
        this.show();
        me.opt.events.rendered && me.opt.events.rendered.call(this);

    },
    addButton: function () {
        var me = this, opt = me.opt, btn = opt.btn;
        var btnContainer = this.c.querySelector(btn.parent);
        btn.buttons && btn.buttons.forEach(function (button) {
            var b = msj.createEl('div',
                {
                    className: button.cls || 'pop-button',
                    innerHTML: button.text
                })
            if (button.events) {
                for (var i in button.events) {
                    b.addEventListener(i, function (e) {
                        button.events[i].call(me, e);
                    });
                }
            }
            btnContainer.appendChild(b);
        })

    },
    update: function (data, isRender) {
        this.setData(data);
        isRender && this.render();
    },
    hide: function () {
//        this.c.style.display = 'none';
        this.c.style.webkitTransform = 'scale(0)'

    },
    show: function () {
//        this.c.style.display = 'block';
        this.c.style.webkitTransform = 'scale(1)'
    },
    destroy: function () {

    }
}