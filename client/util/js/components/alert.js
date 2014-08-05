/**
 * Created by a2014 on 14-8-5.
 */
function alert(o) {
    this.getOpt = function () {
        return o;
    }
    this.init();
}

alert.prototype = {
    init: function () {
        var me = this,
            opt = this.getOpt(),
            title = opt.title,
            content = opt.text;

        this.el = msj.createEl('div', {
            className: 'alert-c ' + (opt.theme || 'blue')
        })

        title && (this.title = msj.createEl('div', {
                className: 'alert-title',
                innerHTML: title
            }
        ));

        this.close = msj.createEl('div', {
            className: 'alert-close',
            innerHTML: 'X'
        })
        content && ( this.content = msj.createEl('div', {
            className: 'alert-content',
            innerHTML: content,
            style: {
                width: '100%',
                textAlign: 'left',
                display: 'inline-block',
                padding: '5px 10px'
            }
        }))
        if (this.title) {
            this.title.appendChild(this.close);
            this.el.appendChild(this.title);
        }
        if (this.content) {
            this.el.appendChild(this.content);
            if (!this.title) {
                this.content.appendChild(this.close);
            }
        }


        this.addEvent();

    },
    render: function () {
        document.body.appendChild(this.el);
        this.width = this.el.offsetWidth;
        var me = this;
        this.show();
        setTimeout(function () {
            me.hide.call(me);
        }, me.getOpt().timeout || 3000);
    },
    show: function () {
        this.el.style.opacity = 1;
        this.el.style.right = 0;
    },
    hide: function () {
        this.el.style.opacity = 0;
        this.el.style.right = -this.width + 'px';
    },
    addEvent: function () {
        var me = this;
        this.close.onclick = function (e) {
            me.hide();
        }
    },
    destroy: function () {
        this.el.parentNode.removeChild(this.el);
    }
}