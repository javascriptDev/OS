/**
 * Created by addison on 14-6-26.
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
    this.init();
}

Grid.prototype = {
    init: function () {
        this.createBase();
        this.setTitle();
        this.setToolBar();
        this.setField();
        this.setContent();
        this.setFoot();
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
    setContent: function () {
        var html = template.compile(this.tpl)(this.data);
        this.contentEl.innerHTML = html;
    },
    setFoot: function () {
        var html = '<div class="page"><div class="last"><</div><div class="p">1</div><div class="p">2</div><div class="p">3</div><div class="next">></div></div><div class="data-info"></div>'
        this.footEl.innerHTML = html;

        this.controls.info = this.footEl.querySelector('.data-info');
        this.setInfo();
    },
    setInfo: function () {
        this.controls.info.innerHTML = 'all:' + this.data.list.length + ' 条数据';
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
    addEvent: function () {
        var me = this;
        var data = {
            cm: 1,
            price: 100,
            count: 1
        };
        this.controls.addBtn.onclick = function () {
            me.addData(data);
        }
    }
};