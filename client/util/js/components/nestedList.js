/**
 * Created by a2014 on 14-7-30.
 */
function NestedList(o) {
    var _data = o.data || [];
    this.opt = o;
    this.getData = function () {
        return _data;
    }
    this.itemWidth = 150;
    this.init();
}
NestedList.prototype = {
    init: function () {
        this.createBase();
        this.createItem();
        this.addEvent();
    },
    createBase: function () {
        var me = this;
        this.c = msj.createEl('div', {
            className: 'g-nestedList',
            style: {
                height: me.opt.height,
                width: me.opt.width
            }
        })
        this.el = msj.createEl('div', {
                className: 'g-nestedlist-inner',
                style: {
                    height: '100%'
                }
            }
        )
        this.c.appendChild(this.el);
    },
    createItem: function (data, tpl, isAdd) {
        var me = this;
        !data && (data = this.getData());
        !tpl && (tpl = this.opt.tpl);
        var itemContainer = msj.createEl('div', {
            className: 'g-itemContainer',
            style: {
                width: me.itemWidth + 'px'
            }
        });
//        this.el.style.width = (parseInt(this.el.style.width) || 0) + me.itemWidth + 'px';
        this.el.appendChild(itemContainer);
        itemContainer.innerHTML = template.compile(tpl)({list: data});
        Array.prototype.forEach.call(itemContainer.childNodes, function (item, index) {
            item.dataItems = JSON.stringify(data[index].items);
            item.dataChild = JSON.stringify(data[index].child);
            item.dataTpl = data[index].tpl;
        })
        this.c.scrollLeft = 9999;

    },
    render: function () {
        this.opt.parent.appendChild(this.c);
        return this;
    },
    addEvent: function () {
        var me = this;
        this.el.onclick = function (e) {

            var target = e.target.className == 'nestedlist-item' ? e.target : e.target.offsetParent;
            if (target.className == 'nestedlist-item') {
                var items = target.dataItems,
                    child = target.dataChild;
                var childData = null;
                me.delNextEl(target.parentNode);
                items && me.createItem(JSON.parse(items), target.dataTpl);
                child && ( childData = JSON.parse(child)) && me.createItem(childData, childData.tpl);

            } else if (target.className == 'list-item') {
                if (target.className.indexOf('nested-selected') == -1) {
                    target.className += ' nested-selected';
                } else {
                    target.className -= ' nested-selected';
                }
            }
        }
    },
    delNextEl: function (el) {
        var recursion = function (el) {
            if (el.nextElementSibling) {
                var ele = el.nextElementSibling;
                ele.parentNode.removeChild(ele);
                recursion(ele);
            }
        }
        recursion(el);
    }
}