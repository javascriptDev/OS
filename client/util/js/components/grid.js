/**
 * Created by addison on 14-6-26.
 *
 *json data grid
 *
 * 控件dom结构
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
 *
 * 用法:
 * var grid = new Grid({
        parent: '.right',                            * 父容器选择器
        title: 'grid demo',                          * grid title
        fields: [                                    * grid 显示的字段
            {en: 'cm', cn: '菜名'},                       1.页面显示的字段
            {en: 'price', sum: true, cn: '价钱'},         2.数据字段
            {en: 'count', cn: '份数'}                     3.sum:开启汇总
        ],
        data: {list: datas},                         * grid 数据
        isQuery: false,                              * 是否开启查询
        height: 500,                                 * 控件高度
        width: 1024,                                 * 控件宽度
        isMulti: false,                              * 是否启用多选
        page: {
            count: 15                                * 分页煤业显示的数据条目数
        }
    });
 *
 *
 */
function Grid(o) {
    //title
    this.title = o.title || 'gird-demo';
    this.width = o.width || 500;
    this.height = o.height || 400;
    //是否启用查询
    this.isQuery = o.isQuery || true;
    //需要汇总的字段
    this.sumField = [];
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
        this.update();
        this.addEvent();
        this.render();
        this.setCss();
    },
    update: function () {
        //todo: 每次添加一条数据，都要执行这个。有点浪费资源
        this.setFoot();
        this.paging();
        this.setContent(this.page.ci);
        this.setInfo();

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
        var fields = '';
        //模板
        var tpl =
            "<%for (var i=0;i<list.length;i++) {%>" +
            "<div class='list-item'><div class='g-field line'></div>";

        //生成模板，添加表头
        this.fields.forEach(function (item) {
            //添加到模板
            tpl += "<div class='g-field " + item.en + "'> <%=list[i]['" + item.en + "']%></div>";
            //添加到fields 用于生成表头
            fields == '' ? (fields += '<div class="g-field line-field">序号</div>') : null;
            fields += '<div class="g-field g-f">' + item.cn + '</div>';
            //找出需要汇总的字段
            item.sum && me.sumField.push(item.en);
        })
        me.fieldEl.innerHTML = fields;
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
        });


        var data = {list: pageData || []};
        var html = template.compile(this.tpl)(data);
        this.contentEl.innerHTML = html;

        this.setLineNumber();
        this.sumField.length > 0 ? this.setSum(pageData) : null;
        this.setPageBarSelect();
    },
    //设置行号
    setLineNumber: function () {
        var index = this.page.ci;
        var countPerPage = this.page.count;
        Array.prototype.forEach.call(this.contentEl.querySelectorAll('.line'), function (line, i) {
            line.innerHTML = index * countPerPage + i + 1;
        })
    },
    //生成汇总行
    setSum: function (data) {
        var sf = this.sumField;
        var o = {};
        this.fields.forEach(function (f) {
            if (sf.join('').indexOf(f.en) == -1) {
                o[f.en] = '-';
            } else {
                o[f.en] = 0;
            }
        })
        data.forEach(function (item) {
            sf.forEach(function (field) {
                o[field] += parseInt(item[field]);
            })
        })
        //添加总计dom
        this.addItem({list: [o]}, function beforeAdd(dom) {
            dom.firstChild.innerHTML = '总计';
        });

    },
    setFoot: function () {
        var me = this;
        var html = '<div class="page"><div class="last p-bar"><</div><div class="middle-bar"></div><div class="next p-bar">></div></div><div class="data-info"></div>'
        this.footEl.innerHTML = html;
        this.controls.info = this.footEl.querySelector('.data-info');
        this.pagingBarEl = this.footEl.querySelector('.middle-bar');
        this.lastPageEl = this.footEl.querySelector('.last');
        this.nextPageEl = this.footEl.querySelector('.next');

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
        //分页中间的12345...
        this.pagingBarEl.onclick = function (e) {
            if (e.target.className == 'p-bar') {
                var index = parseInt(e.target.dataset['index']);
                me.page.ci = index;
                me.setContent(index);
            }
        }

    },
    //设置右下角数据总数
    setInfo: function () {
        this.controls.info.innerHTML = '共:' + this.page.pageCount + '页 | 全部:' + this.data.list.length + ' 条';
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
        // this.addItem({list: [data]});
        this.update();
    },
    addItem: function (data, beforeAdd) {
        var html = template.compile(this.tpl)(data);
        var c = document.createElement('div');
        c.innerHTML = html;
        var el = c.firstChild;
        c = null;
        beforeAdd && beforeAdd(el);
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
        for (var i = 0; i < forCount; i++) {
            this.pagingBarEl.appendChild(this.createPagingBar(i));
        }
    },
    setPageBarSelect: function () {
        var el = document.querySelector('.pb-selected');
        if (el)  el.className = el.className.replace('pb-selected', '').replace(/(^\s+)|(\s+$)/g, '');
        this.pagingBarEl.childNodes[this.page.ci].className += ' pb-selected';
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
    }
};