/**
 * Created by ad on 14-5-3.
 */

    //constructor
function Tree(cfg) {
    this.el = this.createBase();
    this.parent = document.querySelector(cfg.parent) || document.body;
    this.data = cfg.data || [];
    this.mdata = cfg.mdata || [];
    this.dragStart = cfg.dragStart;
    this.leafClick = cfg.leafClick;
    this.baseColor = cfg.baseColor;
    this.structureIndex = 0;
    this.init();
}

//增加原型方法
Tree.prototype = {
    getUuid: function () {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());

    },
    //create base html
    createBase: function () {
        var c = document.createElement('div');
        c.className = 'j-tree';
        return c;
    },
    //add dom to document
    render: function () {
        var me = this, el = [];
        Array.prototype.forEach.call(this.data, function (item, index) {
            //一个类别下得节点
            var node = me.createNode(item.node, item.id),
                area = node.getDom(),
            //一个类别下面所有的子节点
                leafColl = node.getChildC();
            //遍历所有节点,并添加到 leafColl 上
            me.recursion(leafColl, item.items, item.node);

            me.el.appendChild(area);
        });
        this.parent.appendChild(this.el);
        //用于 collapse expand css animation
        Array.prototype.forEach.call(this.el.querySelectorAll('.leaf-container'), function (item) {
            item.height = item.offsetHeight + 'px';
            item.style.height = item.height;
        })
    },
    //update data structure
    addData: function (target, data) {
        var me = this;
        for (var i = 0, len = target.length; i < len; i++) {
            if (target[i].id == data.pid) {
                if (data.type == 'folder') {
                    target[i].items.push({
                        node: data.node,
                        items: [],
                        id: data.id
                    })
                } else {
                    target[i].items.push({
                        name: data.name,
                        text: data.text
                    })
                }
            } else {
                if (target[i].node) {
                    me.addData(target[i].items, data);
                }
            }
        }
        //todo:节点名字相同，data会加错节点
    },
    //create node
    createNode: function (text, id) {
        //添加大类别 like control,event..
        var area = document.createElement('div');
        area.className = 'area-type';

        //创建该类别下所有节点的容器
        var leafColl = document.createElement('div');
        leafColl.className = 'leaf-container';

        var a = document.createElement('div');
        a.className = 'node-dom rtl10 rtr10 ' + this.baseColor;
        a.setAttribute('data-id', id);
        a.innerHTML = '<i class="icon expand"></i>' + text;
        area.appendChild(a);
        area.appendChild(leafColl);


        return {
            getChildC: function () {
                return leafColl;
            },
            getDom: function () {
                return area;
            }
        };

    },
    //递归
    recursion: function (parent, items, type) {
        var me = this;
        Array.prototype.forEach.call(items, function (leaf) {
            if (!leaf.items) {
                var el = me.createLeaf(leaf.name, leaf.text, type).getDom();
                parent.appendChild(el);
            } else {
                var node = me.createNode(leaf.node, leaf.id),
                    dom = node.getDom();
                parent.appendChild(dom);
                me.recursion.call(me, node.getChildC(), leaf.items, leaf.node);
            }
        });
    },
    //create leaf node
    createLeaf: function (name, text, type) {
        var a = document.createElement('div');
        a.className = 'leaf-dom';
        a.innerHTML = text;
        a.id = name + '-' + Math.floor(Math.random() * 100000);
        a.setAttribute('data-type', type);
        a.setAttribute('data-name', name);

        a.setAttribute('draggable', true);

        a.uuid = this.getUuid();
        return {
            add: function (dom) {
                a.appendChild(dom);
                return this;
            },
            getDom: function () {
                return  a;
            }
        }
    },
    //add click and drag event
    addEvent: function () {
        var me = this;
        this.el.onclick = function (e) {
            var cls = e.target.className;
            if (cls) {
                if (cls.indexOf('node-dom') != -1) {
                    me.nodeClick(e.target);
                } else if (cls.indexOf('leaf-dom') != -1) {
                    me.cancelOtherSelect();
                    me.select(e.target);
                    me.leafClick && me.leafClick(e);
                }
            }
        }
        if (this.isDrag) {
            this.el.ondragstart = function (e) {
                var cls = e.target.className;
                if (cls) {
                    if (cls == 'leaf-dom') {
                        me.leafEventHandler.call(me, e);
                    }
                }
            }
        }
        if (this.mdata.length > 0) {
            this.el.addEventListener('contextmenu', function (e) {
                me.addMenuEvent(e);
            }, false);
        }
    },
    //add context menu event
    addMenuEvent: function (e) {
        //  this is a tree object
        e.preventDefault();
        if (e.target.className.indexOf('node-dom') != -1 || e.target.className.indexOf('middle-dom') != -1) {
            this.menu.target = e.target.parentNode.querySelector('.leaf-container');
            this.menu.node = e.target;
            this.menu.show({x: e.x, y: e.y});
        }

    },
    //add a menu object as a property
    addMenu: function () {
//        this is a tree object
        var me = this, mdata = this.mdata;

        this.menu = new Menu({
            data: mdata,
            itemClick: function (e, type, name, text) {
                //this is a menu object
                //e is menu click event params
                //node 弹出menu 时，点击的 tree node
                //target  弹出menu时，点击的tree node 下面的item container
                var data = {
                    pid: this.node.dataset['id']
                }, dom;
                if (type == 'folder') {
                    data.node = name;
                    data.items = [];
                    data.type = 'folder';
                    var id = me.getUuid()
                    data.id = id;
                    dom = me.createNode(text, id).getDom();
                } else {
                    data.name = name;
                    data.text = text;
                    data.type = 'file';
                    dom = me.createLeaf(name, text, type).getDom();
                }
                this.hide();
                this.target.appendChild(dom);
                me.addData(me.data, data);
            }
        });
    },
    //leaf node drag
    leafEventHandler: function (e) {
        if (this.dragStart) {
            this.dragStart(e);
        }
    },
    select: function (el) {
        if (el.className.indexOf('leaf-selected') == -1) {
            el.className += ' leaf-selected';
        }
    },
    cancelOtherSelect: function () {
        var selected = this.el.querySelector('.leaf-selected');
        selected && (selected.className = selected.className.replace('leaf-selected', '').replace(/(^\s+)|(\s+$)/g, ''));

    },
    //node click (expand and collapse)
    nodeClick: function (dom) {

        var el = dom.querySelector('i'),
            cls = el.className;
        var ele = dom.parentNode.querySelector('.leaf-container');
        if (cls.indexOf('collapse') != -1) {
            el.className = cls.replace('collapse', 'expand');
            ele.style.webkitTransform = 'scaleY(1)'
            ele.style.height = ele.height;
        } else {
            el.className = cls.replace('expand', 'collapse');
            ele.style.webkitTransform = 'scaleY(0)'
            ele.style.height = '0';
        }
    },
    //initialize
    init: function () {
        //添加tree事件
        this.addEvent();
        if (this.mdata.length > 0) {
            this.addMenu();
        }
        this.render();
    },
    //get structure of the tree
    getStructure: function () {
        var structure = [];
        //传进方法,去填充
        this.getSingle(this.data, '', structure);
        return structure;
    },
    //获取数据结构,并输出tree结构
    getSingle: function (data, url, structure) {
        var me = this;
        var data = data || this.data;
        var url = url || '';
        for (var i = 0, len = data.length; i < len; i++) {
            var items = data[i].items;
            if (items) {
                if (items.length > 0) {
                    this.getSingle(items, url + (data[i].node + '/'), structure);
                } else {//空文件夹
                    structure.push(url + data[i].node);
                }
            } else {
                structure.push(url + data[i].text);
            }
        }
    }
}



