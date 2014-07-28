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
    },
    addEvent: function () {
        var opt = this.opt,
            btn = opt.btn;
        btn.ok && (btn.ok.onclick = opt.submit && null)
        btn.quit && (btn.quit.onclick = opt.quit || function (e) {

        });
        btn.reset && (btn.reset.onclick = opt.reset || function (e) {

        })

    }
}