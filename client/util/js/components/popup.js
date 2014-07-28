/**
 * Created by a2014 on 14-7-28.
 */
function popup(opt) {
    this.opt = opt;
    this.init();

}


popup.prototype = {
    init: function () {
        this.el = util.createEl('div', {
            className: 'addison-popup',
            style: {
                
            }
        });
    }

}