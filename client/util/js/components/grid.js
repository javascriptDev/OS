/**
 * Created by addison on 14-6-26.
 *
 *json data grid
 *
 * 结构
 * -----------------------------
 * -         title             -
 * -----------------------------
 * -         toolbar           -
 * -----------------------------  - -
 * -        fields             -  c -
 * -----------------------------  o -
 * -                           -  n -
 * -        content            -  t -
 * -                           -  e -
 * -                           -  n -
 * -                           -  t -
 * -----------------------------  - -
 * -   page     -   data info  -
 * -----------------------------
 *
 */
function Grid(o) {
    //title
    this.title = o.title || 'gird-demo';
    this.width = o.width || 500;
    this.height = o.height || 400;
    //是否启用查询
    this.isQuery = o.isQuery || true;
    //list fields
    this.fields = o.fields || [];
    this.data = o.data || [];
    this.opt = o;
    this.parent = document.querySelector(o.parent);
    this.controls = {};
    this.selectItem = [];
    this.isMulti = o.isMulti;
    this.page = { count: o.page.count, page: 0, all: 0, ci: 0};
    this.init();
}

Grid.prototype = {
    init: function () {
        this.createBase();
        this.setTitle();
        this.setToolBar();
        this.setField();
        this.setContent(this.page.ci);
        this.setFoot();
        this.paging();
        this.setInfo();
        this.addEvent();
        this.render();
        this.setCss();
    },
    setCss: function () {
        this.el.style.width = this.width + 'px';
        this.el.style.height = this.height + 'px';
        this.el.style.maxHeight = this.height + 'px';
        var cs = this.contentEl.style;
        cs.height = this.height - this.titleEl.offsetHeight - this.fieldEl.offsetHeight - this.toolbarEl.offsetHeight - this.footEl.offsetHeight + 'px';
    },
    //创建骨架dom
    createBase: function () {
        var div = document.createElement('div');
        div.className = 'a-grid';
        div.innerHTML = '<div class="g-title"></div>' +
            '<div class="g-tools"></div>' +
            '<div class="g-content">' +
            '<div class="g-fields"></div>' +
            '<div class="g-list"></div>' +
            '</div>' +
            '<div class="g-foot"></div>';
        this.titleEl = div.querySelector('.g-title');
        this.toolbarEl = div.querySelector('.g-tools');
        this.fieldEl = div.querySelector('.g-fields');
        this.contentEl = div.querySelector('.g-list');
        this.footEl = div.querySelector('.g-foot');
        this.el = div;
    },
    setTitle: function () {
        this.titleEl.innerHTML = this.title;
    },
    setToolBar: function () {
        var html = '<button class="g-add">添加</button>' +
            '<button class="g-del">删除</button>' +
            '<button class="g-refresh">刷新</button>'
        if (this.isQuery) {
            html += '<div class="g-query"><input type="text"><button class="query">查询</button></div>'
        }
        this.toolbarEl.innerHTML = html;
        this.controls.addBtn = this.toolbarEl.querySelector('.g-add');
        this.controls.delBtn = this.toolbarEl.querySelector('.g-del');
        this.controls.refreshBtn = this.toolbarEl.querySelector('.g-refresh');
        this.controls.query = this.toolbarEl.querySelector('.g-query');
    },
    setField: function () {
        var me = this;
        var tpl =
            "<%for (var i=0;i<list.length;i++) {%>" +
            "<div class='list-item'>";
        this.fields.forEach(function (item) {
            tpl += "<div class='g-filed " + item.en + "'> <%=list[i]['" + item.en + "']%></div>";
            me.fieldEl.innerHTML += '<div class="g-filed g-f">' + item.cn + '</div>';
        })
        tpl += "</div>" +
            "<%}%>";
        //根据字段生成模板
        this.tpl = tpl;
    },
    setContent: function (pageIndex) {
        var me = this;
        if (!pageIndex) pageIndex = 0;
        var min = me.page.ci * me.page.count,
            max = (me.page.ci + 1) * me.page.count;
        var pageData = me.data.list.filter(function (nextIndex, currentIndex) {
            if (currentIndex >= min && currentIndex < max) {
                return me.data.list[currentIndex];
            }
        })
        var data = {list: pageData || []};
        var html = template.compile(this.tpl)(data);
        this.contentEl.innerHTML = html;
    },
    setFoot: function () {
        var html = '<div class="page"><div class="last p-bar"><</div><div class="middle-bar"></div><div class="next p-bar">></div></div><div class="data-info"></div>'

        //
        this.footEl.innerHTML = html;
        this.controls.info = this.footEl.querySelector('.data-info');
        this.pagingBarEl = this.footEl.querySelector('.middle-bar');
        this.lastPageEl = this.footEl.querySelector('.last');
        this.nextPageEl = this.footEl.querySelector('.next');

    },
    //设置右下角数据总数
    setInfo: function () {
        this.controls.info.innerHTML = '全部:' + this.data.list.length + ' 条数据';
    },
    render: function () {
        this.parent.appendChild(this.el);
    },
    addData: function (data) {
        for (var i = 0, len = this.fields.length; i < len; i++) {
            //确保添加的数据包含所有 该有的字段
            if (!data.hasOwnProperty(this.fields[i].en)) {
                console.log('add data failed');
                break;
                return;
            }
        }
        this.data.list.push(data);
        this.addItem({list: [data]});
    },
    addItem: function (data) {
        var html = template.compile(this.tpl)(data);
        var c = document.createElement('div');
        c.innerHTML = html;
        var el = c.childNodes[0];
        c = null;
        this.contentEl.appendChild(el);
        this.setInfo();
    },
    createPagingBar: function (i) {
        var div = document.createElement('div');
        div.className = 'p-bar';
        div.setAttribute('data-index', i);
        div.innerHTML = i;
        return div;
    },
    paging: function () {
        var pages;
        var pagesTem = this.data.list.length / this.page.count;
        /^-?[1-9]d*$/.test(pagesTem) ? pages = pagesTem : pages = Math.ceil(pagesTem);
        this.page.pageCount = pages;
        this.page.all = this.data.list.length;
        var forCount = 0;
        pages > 4 ? forCount = 4 : forCount = pages;
        for (var i = 0; i < pages; i++) {
            this.pagingBarEl.appendChild(this.createPagingBar(i));
        }
    },
    sort: function () {
    },
    addEvent: function () {
        var me = this;
        var data = {
            cm: 1,
            price: 100,
            count: 1
        };
        //添加数据
        this.controls.addBtn.onclick = function () {
            me.addData(data);
        }
        //删除数据
        this.controls.delBtn.onclick = function () {
            var selectItem = me.contentEl.querySelectorAll('.item-selected');
            //todo:删除数据是否数据加 UUID
        }
        //list item click
        this.contentEl.onclick = function (e) {
            var target = e.target.offsetParent;
            //单选模式
            if (!me.isMulti) {
                var el = me.contentEl.querySelector('.item-selected');
                if (!el) {
                    target.className += ' item-selected';
                } else {
                    if (el == target) {
                        target.className = target.className.replace('item-selected', '').replace(/(^\s+)|(\s+$)/g, '');
                    } else {
                        el.className = el.className.replace('item-selected', '').replace(/(^\s+)|(\s+$)/g, '');
                        target.className += ' item-selected';
                        //    me.selectItem.push(target);
                    }
                }
            } else {//多选模式

                if (target.className.indexOf('item-selected') == -1) {
                    target.className += ' item-selected';
                    //  me.selectItem.push(target);
                } else {
                    target.className = target.className.replace('item-selected', '').replace(/(^\s+)|(\s+$)/g, '');
                    //me.selectItem
                }
            }

        }
        //分页事件
        //上一页
        this.lastPageEl.onclick = function () {
            if (me.page.ci > 0) {
                me.page.ci -= 1;
                me.setContent(me.page.ci);
            }
        };
        //下一页
        this.nextPageEl.onclick = function () {
            if (me.page.ci < me.page.pageCount - 1) {
                me.page.ci++;
                me.setContent(me.page.ci);
            }
        }

    }
};