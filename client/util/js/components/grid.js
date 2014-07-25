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
            {en: 'cm', cn: '菜名'},                        1.页面显示的字段
            {en: 'price', sum: true, cn: '价钱'},          2.数据字段
            {en: 'count', cn: '份数',sort:true}             3.sum:  true|false  开启汇总
                                                           4.sort: true|false  开启排序
        ],
        data: {list: datas},                         * grid 数据 数组  data demo:[ {cm:'阿什顿',price:11,count:1},...]
        isQuery: false,                              * 是否开启查询
        height: 500,                                 * 控件高度
        width: 1024,                                 * 控件宽度
        isMulti: false,                              * 是否启用多选
        page: {
            count: 15                                * 分页煤业显示的数据条目数
        },
        isToolbar: false,                            * 是否加载toolbar
        isFooter: false,                             * 是否加载foot
        isTitle: false,                              * 是否加载title

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
    //需要排序的字段
    this.sortField = [];
    //需要添加事件的button
    this.btnEvent = [];
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
    update: function (data, fn) {
        //todo: 每次添加一条数据，都要执行这个。有点浪费资源
        this.setFoot();
        this.paging();
        this.setContent(this.page.ci, data);
        this.setInfo();
        fn && fn.call(this);

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
            if (item.isHide) {
                tpl += "<div class='g-field hidden' id='<%=list[i]['" + item.en + "']%>'></div>";
            } else if (item.buttons) {
                tpl += "<div class='g-field " + item.en + "'>";
                item.buttons.forEach(function (btn) {
                    var button = document.createElement('button');
                    button.innerHTML = btn.text;
                    button.className = 'g-operate';
                    button.id = btn.id;
                    button.setAttribute('data-id', "<%= list[i]['" + btn.require + "']%>")
                    tpl += button.outerHTML;
                })
                tpl += '</div>';
            } else {
                tpl += "<div class='g-field " + item.en + "'> <%=list[i]['" + item.en + "']%></div>";
            }
            //添加到fields 用于生成表头
            fields == '' ? (fields += '<div class="g-field line-field">序号</div>') : null;
            if (!item.isHide) {
                if (item.sort) {
                    fields += '<div class="g-field g-f sort" data-type="asc"  data-name="' + item.en + '">' + item.cn + '</div>';
                } else {
                    fields += '<div class="g-field g-f">' + item.cn + '</div>';
                }
            }
            //找出需要汇总的字段
            item.sum && me.sumField.push(item.en);
            //找出需要排序的字段
            item.sort && me.sortField.push(item.en);
            //找出需要添加事件的btn
            item.buttons && me.btnEvent.push(item.buttons);
            //找出需要添加事件的button
//            item.buttons&&me.btns.push(item.buttons);
        })
        me.fieldEl.innerHTML = fields;
        tpl += "</div>" +
            "<%}%>";
        //根据字段生成模板
        this.tpl = tpl;
    },
    setContent: function (pageIndex, newData) {
        var me = this;
        newData = newData || me.data;
        if (!pageIndex) pageIndex = 0;
        var min = me.page.ci * me.page.count,
            max = (me.page.ci + 1) * me.page.count;
        var pageData = newData.list.filter(function (nextIndex, currentIndex) {
            if (currentIndex >= min && currentIndex < max) {
                return newData.list[currentIndex];
            }
        });

        var data = {list: pageData || []};
        var html = template.compile(this.tpl)(data);
        this.contentEl.innerHTML = html;

        //设置行号
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
                o[field] += item[field];
            })
        })
        //添加总计dom
        this.addItem({list: [o]}, function beforeAdd(dom) {
            dom.className += ' g-sum';
            dom.firstChild.innerHTML = '总计';
        }, function added(dom) {
            dom.removeChild(dom.querySelector('.operate'));
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
    //操作本地data，重新生成grid
    addData: function (data) {
        var me = this;
        data.forEach(function (item) {
//            for (var i = 0, len = me.fields.length; i < len; i++) {
//                //确保添加的数据包含所有 该有的字段
//                if (!item.hasOwnProperty(me.fields[i].en)) {
//                    console.log('add data failed');
//                    break;
//                    return;
//                }
//            }
            me.data.list.push(item);
        })

        // this.addItem({list: [data]});
        this.update();
    },
    delData: function (id, isUpdate) {
        var me = this;
        this.data.list.forEach(function (item, index) {
            if (item.id == id) {
                me.data.list.splice(index, 1);
            }
        })
        // this.addItem({list: [data]});
        if (isUpdate) {
            this.update();
        }
    },
    updateSingleData: function (id, updataData) {
        // this.delData(data.id, false);
        this.data.list.forEach(function (item) {
            if (item.id == id) {
                for (var i in updataData) {
                    item[i] = updataData[i];
                }
            }
        })
        this.update();

    },
    //当前分页加载一行数据，不操作 grid data
    addItem: function (data, beforeAdd, added) {
        var html = template.compile(this.tpl)(data);
        var c = document.createElement('div');
        c.innerHTML = html;
        var el = c.firstChild;
        c = null;
        //给行添加class。
        beforeAdd && beforeAdd(el);
        //添加到主体上面
        this.contentEl.appendChild(el);
        //
        this.setInfo();
        added && added(el);
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
        var el = this.pagingBarEl.querySelector('.pb-selected');
        if (el)  el.className = el.className.replace('pb-selected', '').replace(/(^\s+)|(\s+$)/g, '');
        try {
            var bar = this.pagingBarEl.querySelector('[data-index="' + this.page.ci + '"]');
            bar && (bar.className += ' pb-selected');
            //默认内容从上往下阅读
            this.contentEl.scrollTop = 0;
        } catch (e) {
            throw new Error(e.message);
        }
    },
    sort: function () {


    },
    query: function () {


    },
    addEvent: function () {
        var me = this;

        this.fieldEl.onclick = function (e) {
            var target = e.target;
            if (target.className.indexOf('sort') != -1) {
                var field = target.getAttribute('data-name');
                var type = target.getAttribute('data-type');
                me.page.ci = 0;


                if (type == 'asc') {
                    target.setAttribute('data-type', 'desc');
                    me.data.list.sort(function (item, item2) {
                        return item[field] < item2[field] ? 1 : -1;
                    });
                } else {
                    target.setAttribute('data-type', 'asc');
                    me.data.list.sort(function (item, item2) {
                        return item[field] > item2[field] ? 1 : -1;
                    })
                }

            }

            me.update();
        }


        //添加数据
        this.controls.addBtn.onclick = function () {
            data.price = Math.random() * 100;
            me.addData(randomData(1));
        }
        //删除数据
        this.controls.delBtn.onclick = function () {
            var selectItem = me.contentEl.querySelectorAll('.item-selected');
            //todo:删除数据是否数据加 UUID
        }
        //list item click
        this.contentEl.onclick = function (e) {

            var target = e.target;
            if (target.className.indexOf('g-field') != -1) {
                target = e.target.offsetParent;
            } else if (target.className.indexOf('g-operate') != -1) {
                me.btnEvent.forEach(function (buttons) {
                    buttons.forEach(function (btn) {
                        if (btn.id == target.id) {
                            btn.click && btn.click.call(null, target.getAttribute('data-id'));
                        }
                    })
                })

            } else if (target.className.indexOf('list-item') == -1) {
                return;
            }
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