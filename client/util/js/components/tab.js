/**
 * Created by addison on 14-6-23.
 */
function query(c, s, isAll) {
    if (isAll) {
        return Array.prototype.slice.call(c.querySelectorAll(s));
    } else {
        return c.querySelector(s);
    }
}

function tab(o) {
    this.el = {};
    this.tabs = [];
    this.contents = [];
    this.opt = o;
    this.ol = o.ol;
    this.init();
}
tab.prototype = {
    initBase: function () {
        var div = document.createElement('div');
        div.innerHTML = '<div class="tabs"></div><div class="contents wrapper"></div>';
        div.className = 'tab-c';
        this.el = div;
        this.tabs = query(div, '.tabs');
        this.contents = query(div, '.wrapper');
    },
    init: function () {
        this.initBase();
        this.render();
        this.addEvent();
    },
    render: function () {
        var tabs = this.opt.tab;
        var content = this.opt.content;
        var me = this;
        tabs.forEach(function (tab, index) {
            me.tabs.appendChild(me.newTab(tab.tab, index));
            me.contents.appendChild(me.newContent(template.compile(tab.tpl)(tab.data), index));
        })
        //默认选中第一个
        this.switchTab(0)

        document.body.appendChild(this.el);

    },
    //创建一个tab
    newTab: function (text, index) {
        var tab = document.createElement('div');
        tab.innerHTML = '<div class="inner-text">' + text + '</div>';
        tab.className = 'tab-item';
        tab.setAttribute('data-index', index);
        return tab;
    },
    //创建一个tab content
    newContent: function (html, index) {
        var c = document.createElement('div');
        c.innerHTML = html;
        c.className = 'content';
        c.setAttribute('data-index', index);
        return c;
    },
    //切换tab显示隐藏
    switchTab: function (index, el) {
        var me = this;
        var selected = query(me.tabs, '.selected');
        if (!selected) {
            query(this.tabs, '.tab-item', true)[parseInt(index)].className += ' selected';
            me.switchContent(index);
        } else {
            if (selected.dataset['index'] != index) {
                selected.className = selected.className.replace('selected', '').replace(/(^\s+)|(\s+$)/g, '');
                el.className += ' selected';
                me.switchContent(index);
            }
        }
        var el = this.contents.querySelectorAll('.content')[index];
        if (el && !el.style.webkitTransform) {

            //添加滚动事件
            addScrollEvent(el, {
                    tap: {
                        item: me.contents,
                        fn: function (e) {
                            if (me.ol) {
                                var el = e.target.offsetParent;
                                if (el.className.indexOf('list-item') != -1) {
                                    var data = {
                                        text: el.querySelector('.text').innerHTML,
                                        value: el.querySelector('.price').innerHTML
                                    }
                                    me.ol.reRender(data);
                                }
                            }
                        }
                    }
                }
            )
            ;
        }

    },
//切换 对应tab的content 显示隐藏
    switchContent: function (index) {

        query(this.contents, '.content', true).forEach(function (c) {
            if (c.dataset['index'] != index) {
                c.style.display = 'none';
            } else {
                c.style.display = 'block';
            }

        })
    },
    addEvent: function () {
        var me = this;
        this.el.addEventListener('touchstart', function (e) {
            e.preventDefault();
        })
        addScrollEvent(this.tabs, {
            tap: {
                el: this.tabs,
                fn: function (e) {
                    var el;

                    if (e.target.className.indexOf('tab-item') != -1) {
                        el = e.target;
                    } else if (e.target.offsetParent.className.indexOf('tab-item') != -1) {
                        el = e.target.offsetParent;
                    }
                    if (el) {
                        var index = el.dataset['index'];
                        me.switchTab(index, el);
                    }
                }
            }
        });
    }
}