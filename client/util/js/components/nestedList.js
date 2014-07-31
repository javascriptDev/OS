/**
 * Created by a2014 on 14-7-30.
 */
function NestedList(o) {
    var _data = o.data || [];
    this.opt = o;
    this.getData = function () {
        return _data;
    }
    this.init();

}

NestedList.prototype = {
    init: function () {
        this.createBase();
        this.createItem();
        this.addEvent();
    },
    createBase: function () {
        this.el = msj.createEl('div', {
            className: 'g-nestedList'
        })

    },
    createItem: function (data, tpl) {
        var me = this;
        !data && (data = this.getData());
        !tpl && (tpl = this.opt.tpl);
        var itemContainer = msj.createEl('div', {
            className: 'g-itemContainer',
            style: {
                width: '150px'
            }
        })
        this.el.appendChild(itemContainer);
        itemContainer.innerHTML = template.compile(tpl)({list: data});
        Array.prototype.forEach.call(itemContainer.childNodes, function (item, index) {
            item.dataItems = JSON.stringify(data[index].items);
            item.dataChild = JSON.stringify(data[index].child);
        })

    },
    render: function () {
        this.opt.parent.appendChild(this.el);
        return this;
    },
    addEvent: function () {
        this.el.onclick = function (e) {
            var target = e.target;
            if (target.className == 'nested-item') {
                
            }
        }

    }


}