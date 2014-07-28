/**
 * Created by a2014 on 14-7-28.
 */
function popup(opt) {
    this.opt = opt;
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
        this.el = msj.createEl('div', {
            className: 'addison-popup',
            style: {
                border: '1px solid red',
                height: opt.height || '400px',
                width: opt.width || '300px'
            }
        });
        if (this.opt.isRender) {
            this.render();
        }

    },
    render: function () {
        this.el.innerHTML = template.compile(this.opt.tpl)(this.getData());
        document.body.appendChild(this.el);
    },
    addEvent: function () {
        var opt = this.opt,
            btn = opt.btn;
        btn.ok && (btn.ok.onclick = opt.submit && null)
        btn.quit && (btn.quit.onclick = opt.quit || function (e) {

        });
        btn.reset && (btn.reset.onclick = opt.reset || function (e) {

        })
    },
    update: function (data, isRender) {
        this.setData(data);
        isRender && this.render();
    },
    hide: function () {
    },
    show: function () {
    },
    destroy: function () {
    }
}