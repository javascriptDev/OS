/**
 * Created by a2014 on 14-7-28.
 */
function popup(opt) {
    this.opt = opt;
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
        this.el.innerHTML = opt.html;
        document.body.appendChild(this.el);
    }

}