/**
 * Created by addison on 14-6-23.
 *
 * web service 请求处理函数
 *
 */
var fs = require('fs');
var db = require('./db/dbHelper').help;

var methods = {
    data: 'data'



}
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
        arr = url.split('/'),
        len = arr.length,
        method = arr[len - 2],
        params = arr[len - 1];
    var data;
    switch (method) {
        case methods.data:
            getData();
            break;
        default :
            res.write('no data');
            res.end();
            break;
    }
    function getData() {
        db.query('order', function (err, data) {
            console.log(data);
            res.writeHead(200, {'Content-Type': head});
            res.write(JSON.stringify(data), 'binary');
            res.end();
        }, {})
    }
}


exports.ws = webServices;