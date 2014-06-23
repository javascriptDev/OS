/**
 * Created by a2014 on 14-6-23.
 */
function query(c, s, isAll) {
    var el = isAll ? ( Array.prototype.slice(c ? c.querySelectorAll(s) : doucment.querySelectorAll(s))) : (c ? c.querySelector(s) : document.querySelector(s));
    return el;
}
function tab(o) {
    this.el = {};
    this.tabs = {};
    this.contents = {};
    this.opt = o;

    this.init();
}

tab.prototype = {
    initBase: function () {
        var div = document.createElement('div');
        div.innerHTML = '<div class="tabs"></div><div class="contents"></div>';
        this.el = div;
        this.tabs = query(div, '.tabs');
        this.contents = query(div, '.contents');
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
        tabs.forEach(function (tab) {
            me.tabs.appendChild(me.newTab(tab));
        })
        document.body.appendChild(this.el);

    },
    newTab: function (text) {
        var tab = document.createElement('div');
        tab.innerHTML = text;
        tab.className = 'tab';
        return tab;
    },
    newContent: function (html) {
        var c = document.createElement('div');
        c.innerHTML = html;
        c.className = 'content';
        return c;
    },
    addEvent: function () {
        this.tabEvent = function (e) {
            var index = e.target.dataset['index'];
            query('.selected').className.replace('selected', ' ');
            e.target.className += ' selected';
        }
        this.tabs.addEventListener('click', this.tabEvent);
        this.tabs.addEventListener('touchstart', this.tabEvent);
    }
}