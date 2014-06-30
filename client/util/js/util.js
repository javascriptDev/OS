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
//    ip: 'http://localhost',
    ip:'http://192.168.165.31',

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
        makeOver: 'mo'

    },
    tpl: {
        a: "<%for (var i=0;i<list.length;i++) {%>" +
            "<div class=list-item>" +
            "<img class=food src='<%= list[i].img %>' />" +
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
            "<%}%>"
    }

}
