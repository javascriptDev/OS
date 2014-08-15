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
    data: 'data',
    memory: 'memory',
    login: 'login'



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
    var params = {};
    param && param.split('&').forEach(function (item) {
        var s = item.split('=');
        params[s[0]] = s[1];
    })
    switch (method) {
        case methods.data:
            getData(params);
            break;
        case methods.login:
            var headers = req.headers,
                origin = headers.origin,
                cookie = headers.cookie,
                ua = headers['user-agent'],
                token = headers.token;
            login(params, {
                origin: origin,
                cookie: cookie,
                ua: ua,
                token: token
            });
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

    function login(params, client) {
        if (isSafe(client)) { //安全性检测
            if (isPass(params)) {//账户验证
                res.write(JSON.stringify({success: 1}));
                res.end();
            } else {
                res.write(JSON.stringify({success: 0}));
                res.end();
            }
        }
    }

    function isSafe(client) {
        var cookie = client.cookie,
            ua = client.ua,
            token = client.token;

    }

    function isPass(params) {
        var name = params.uname,
            pwd = params.pwd;
    }

    function generateCookie() {

    }

//    function getMemoryData(where) {
//        res.setHeader('Access-Control-Allow-Methods', 'GET');
//        res.setHeader('Access-Control-Allow-Origin', '*');
//        var data = JSON.stringify(cache[where.statues]);
//        res.write(data);
//        res.end();
//    }
}


exports.ws = webServices;