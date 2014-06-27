/**
 * Created by addison on 14-6-23.
 *
 * web service 请求处理函数
 *
 */


var fs = require('fs');

function webServices(req, res) {
    var mime = {
        js: 'application/x-javascript',
        css: 'text/css',
        html: 'text/html'
    }

    var head = mime.js + ';charset=utf-8';
    res.writeHead(200, {'Content-Type': head});
    if (u != 'favicon.ico') {
        fs.readFile(url.replace('/', ''), 'utf8', function (err, data) {
            res.write(data);
            res.end();
        });
    }
}


exports.ws = webServices;