/**
 * Created by addison on 14-6-23.
 *
 * web service 请求处理函数
 *
 */


var fs = require('fs');


var methods = {

}

function webServices(req, res) {
    var mime = {
        js: 'application/x-javascript',
        css: 'text/css',
        html: 'text/html',
        json: 'application/x-javascript'
    }

    //http://xxx.xxx.xxx.xx/#ws/action/a=1&b=2
    var head = mime.json + ';charset=utf-8';
    res.writeHead(200, {'Content-Type': head});
    var url = req.url,
        arr = url.split('/'),
        len = arr.length,
        method = arr[len - 2],
        params = arr[len - 1];

    switch (method) {

    }


}


exports.ws = webServices;