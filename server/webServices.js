/**
 * Created by addison on 14-6-23.
 *
 * web service 请求处理函数
 *
 */
var fs = require('fs');
var db = require('./db/dbHelper').help;
var parse = require('url');

var methods = {
    data: 'data'



}

//http://xxx.xxx.xxx.xxx:8000!ws?data/a=1&b=2
var tn = 'order';
function webServices(req, res) {
    var mime = {
        js: 'application/x-javascript',
        css: 'text/css',
        html: 'text/html',
        json: 'application/x-javascript'
    }

    //http://xxx.xxx.xxx.xx/#ws/action/a=1&b=2
    var head = mime.json + ';charset=utf-8';

    var url = req.url,
        base = parse.parse(url).query.split('/'),
        method = base[0],
        param = base[1];

    var data;
    switch (method) {
        case methods.data:
            var params = {};
            param && param.split('&').forEach(function (item) {
                var s = item.split('=');
                params[s[0]] = s[1];
            })
            getData(params);
            break;
        default :
            res.write('no data');
            res.end();
            break;
    }
    function getData(where) {
        db.query('order', function (err, data) {

            res.setHeader('Access-Control-Allow-Methods', 'GET');
            res.setHeader('Access-Control-Allow-Origin', '*');
            var data = JSON.stringify(data);
            res.write(data);
            res.end();
        }, where || {})
    }
}


exports.ws = webServices;