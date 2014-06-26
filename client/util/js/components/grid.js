/**
 * Created by a2014 on 14-6-26.
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
        this.render();
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
    },
    render: function () {
        this.parent.appendChild(this.el);
    },
    addEvent: function () {
    }


};