/**
 * Created by a2014 on 14-7-28.
 */
function popup(opt) {
    this.opt = opt;
    this.rendered = false;
    this.baseColor = opt.baseColor;
    var _data = opt.data || [];
    this.addData = function (data) {
        _data.list[0].data = _data.list[0].data.concat(data);
    }
    this.getData = function () {
        return _data;
    }
    this.setSum = function (val) {
        _data.list[0].price = val;
    }
    this.getSum = function () {
        return _data.list[0].price;
    }
    this.setData = function (data) {
        _data = data;
    }
    this.delData = function (data) {
        this.getDataList().forEach(function (d, index) {
            if (d.text == data.text && d.value == data.value) {
                _data.list[0].data.splice(index, 1);
            }
        })
    }
    this.getDataList = function () {
        return _data.list[0];
    }
    this.refreshChangeList();
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
                    width: opt.width || '700px',
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
        this.listC = this.el.querySelector(this.opt.listContainer);
        this.show();
        me.opt.events.rendered && me.opt.events.rendered.call(this);
        this.listC.onclick = function (e) {
            var tar = e.target;
            if (tar.className == 'pop-list-item-del') {
                me.updataList({
                    text: tar.offsetParent.childNodes[0].innerHTML,
                    value: tar.offsetParent.childNodes[1].innerHTML
                }, false, function () {
                    tar.offsetParent.parentNode.removeChild(tar.offsetParent);
                });
            } else if (tar.className.indexOf('add-one') != -1) {
                me.addOne(tar.parentNode.parentNode.firstChild.innerText, function (count, sum) {
                    tar.nextElementSibling.querySelector('input').value = count;
                    tar.parentNode.nextElementSibling.nextElementSibling.innerHTML = sum;
                    me.el.querySelector('.order-sum').innerHTML = me.getDataList().price;
                });
            } else if (tar.className.indexOf('subtract-one') != -1) {
                var isMade = tar.getAttribute('data-statues') == '' ? false : true;
                !isMade && me.subtractOne(tar.parentNode.parentNode.firstChild.innerText, function (count, sum) {
                    if (count) {
                        tar.parentNode.querySelector('input').value = count;
                        tar.parentNode.nextElementSibling.nextElementSibling.innerHTML = sum;
                        me.el.querySelector('.order-sum').innerHTML = me.getDataList().price;

                    } else {
                        tar.parentNode.parentNode.parentNode.removeChild(tar.parentNode.parentNode);
                    }
                });
            }
        }
    },
    addOne: function (text, cb) {
        var me = this;
        var result = 0;

        var data = me.getDataList(),
            list = data.data;
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].text == text) {
                var count = ++list[i].count ,
                    sum = count * list[i].value;
                data.price = parseInt(data.price) + parseInt(list[i].value);
                list[i].sum = sum;
                var o = {
                    count: count,
                    type: 'alter',
                    text: text,
                    sum: sum
                }
                me.changeList.data.push(o);
                result = o.count;
                break;
            }
        }
        cb && cb(result, sum);
    },
    subtractOne: function (text, cb) {
        var me = this;
        var result = 0;
        var sum = 0;
        var data = me.getDataList(),
            list = data.data;
        for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].text == text) {
                if (list[i].count < 2) {
                    list.splice(i, 1);
                } else {
                    var count = --list[i].count ,
                        sum = count * list[i].value;
                    data.price = parseInt(data.price) - parseInt(list[i].value);
                    list[i].sum = sum;
                    result = count;
                }
                break;
            }
        }
        cb && cb(result, sum);
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
        data && this.setData(data);
        isRender && this.render();
    },
    updataList: function (data, addOrDel, fn) {//true is add . false is del
        var me = this;
        var sum = 0;
        if (addOrDel) {
            data.forEach(function (item) {
                item.type = 'add';
                me.changeList.data.push(item);
            })
            this.addData(data);
            this.listC.innerHTML += template.compile(this.opt.listTpl)({list: data});
            data.forEach(function (val) {
                sum += parseInt(val.value);
            });
            this.setSum(parseInt(this.getSum()) + sum);
        } else {
            data.type = 'del';
            this.changeList.data.push(data)
            this.delData(data);
            sum = this.getSum() - parseInt(data.value);
            this.setSum(parseInt(sum));
        }
        this.el.querySelector('.fred').childNodes[1].innerText = this.getSum();
        fn && fn();
    },
    hide: function () {
        this.c.style.webkitTransform = 'scale(0)'
    },
    show: function () {
        this.c.style.webkitTransform = 'scale(1)'
    },
    destroy: function () {

    },
    refreshChangeList: function () {
        this.changeList = {id: '', data: []};
        return this;
    }
}