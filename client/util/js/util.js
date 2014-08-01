/**
 * Created by addison on 14-6-23.
 */
function inherit(subclass, superclass) {
    var F = function () {
        },
        subclassProto = subclass.prototype,
        superclassProto = superclass.prototype;

    F.prototype = superclassProto;
    subclass.prototype = new F();
    subclass.prototype.constructor = subclass;
    subclass.superclass = superclassProto;

    if (superclassProto.constructor === Object.constructor) {
        superclassProto.constructor = superclass;
    }
    var subProtoMethod = Object.keys(subclassProto);

    Array.prototype.forEach.call(subProtoMethod, function (item) {
        if (subclassProto.hasOwnProperty(item)) {
            if (Object.prototype.toString.call(subclassProto[item]) == '[object Function]') {
                subclass.prototype[item] = subclassProto[item];
            }
        }
    });
    return subclass;
}

msj = {
    ip: 'http://192.168.165.166',
//    ip: 'http://192.168.1.101',

    role: {
        //显示设备
        monitor: 'monitor',
        //记账
        base: 'base',
        //终端，点菜器
        terminal: 'terminal'
    },
    et: {
        addDesk: 'addDesk',
        login: 'login',
        loginSuccess: 'ls',
        makeOver: 'mo',
        pay: 'pay'

    },
    tpl: {
        a: "<%for (var i=0;i<list.length;i++) {%>" +
            "<div class=list-item>" +
            "<img class=food src='<%= list[i].img %>' />" +
            "<div class=text><%=list[i].text%></div>" +
            "<div class=price><%= list[i].price%></div>" +
            "</div>" +
            "<%}%>",
        e: "<%for (var i=0;i<list.length;i++) {%>" +
            "<div class=list-item>" +
            "<div class=text><%=list[i].text%></div>" +
            "<div class=price><%= list[i].price%></div>" +
            "</div>" +
            "<%}%>",
        b: "<%for (var i=0;i<list.length;i++) {%>" +
            "<div class='list-item ol-list-item'>" +
            "<div class=ol-text><%=list[i].text%></div>" +
            "<div class=ol-price><%=list[i].value%></div>" +
            "<div class=ol-del data-id=<%=list[i].id%> >X</div>" +
            "</div>" +
            "<%}%>",
        c: "<%for (var i=0;i<list.length;i++) {%>" +
            "<div class='list-item'>" +
            "<div class=text><%=list[i].text%></div>" +
            "</div>" +
            "<%}%>",
        d: "<%for (var i=0;i<list.length;i++) {%>" +
            "<div class='nestedlist-item'><%=list[i].text%></div>" +
            "<%}%>",
        popup: "<div class=pop-title>交易详情</div>" +
            "<%for (var i=0;i<list.length;i++) {%>" +

            "<div class=order-list-item-container>" +
            "<div class=pop-list-item>桌号</div>" +
            "<div class=pop-list-item><%=list[i].did%></div>" +
            "</div>" +

            "<div class=order-list>" +
            "<div class='order-list-item-container list-field'>" +
            "<div class=pop-list-item>菜名</div>" +
            "<div class=pop-list-item>单价</div>" +
            "</div>" +

            "<div class='order-list-body'>"+
            "<%for (var j=0;j<(list[i].data&&list[i].data.length);j++) {%>" +
            "<div class=order-list-item-container>" +
            "<div class=pop-list-item><%= list[i].data[j].text%></div>" +
            "<div class=pop-list-item><%= list[i].data[j].value%></div>" +
            "</div>" +
            "<%}%>" +
            "</div>"+
            "</div>" +

            "<div class='order-list-item-container fred'>" +
            "<div class=pop-list-item>总价</div>" +
            "<div class='pop-list-item '><%=list[i].price%></div>" +
            "</div>" +

            "<div class=btn-c></div>" +
            "</div>" +
            "<%}%>",
        popList: "<%for (var j=0;j<list.length;j++) {%>" +
            "<div class=order-list-item-container>" +
            "<div class=pop-list-item><%= list[j].text%></div>" +
            "<div class=pop-list-item><%= list[j].value%></div>" +
            "</div>" +
            "<%}%>"
    },
    createEl: function (domName, cfg) {
        var el = document.createElement(domName);
        msj.recursion(el, cfg);
        return el;
    },
    //递归函数
    recursion: function (dom, o) {
        for (var i in o) {
            if (Object.prototype.toString.call(o[i]) == '[object Object]') {
                msj.recursion(dom[i], o[i]);
            } else {
                dom[i] = o[i];
            }
        }
    }






}

