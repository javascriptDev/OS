/**
 * Created by a2014 on 14-7-25.
 */
function getData(params, fn, needParse, method) {
    request(msj.ip + ':8000/!ws?' + method + '/' + params,'', function (data) {
        var param = data;
        needParse && (param = parseData(param));
        fn && fn({list: param || []});
    })
}
function parseData(data) {
    var result = [];
    for (var i = 0, len = data.length; i < len; i++) {

        var d = data[i];
//        var time = new Date(parseInt(d._id.substr(0, 8), 16));
        var o = {did: 0, order: '', price: 0};
        o.did = d.dn;
        o.id = d._id;
        o.statues = d.statues;
        o.time = msj.getDate(d.date);
        o.data = d.data.list;
        var detail = d.data.list;
        for (var j = 0, l = detail.length; j < l; j++) {
//            o.order += detail[j].text + ':' + parseInt(detail[j].value) + '\r\n,';
            o.price += parseInt(detail[j].sum);
        }
        result.push(o);
    }
    return result;
}
function unparseData(data) {
    var o = {}
    o.dn = data.did;
    o.statues = data.statues;
    o.data = {list: data.data};
    o._id = data.id;
    return o;
}
function request(url, method, cb) {
    var xhr;
    if (window.XMLHttpRequest) { // Mozilla, Safari,...
        xhr = new XMLHttpRequest();

    } else if (window.ActiveXObject) { // IE
        try {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
            }
        }
    }
    if (!xhr) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    xhr.open(method || 'get', url);
    xhr.send();
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            cb && cb(JSON.parse(xhr.responseText));
        }
    }
}
