/**
 * Created by a2014 on 14-6-23.
 */
var fs = require('fs');


function staticFile(req, res) {
    var url = req.url;
    var enter = {
        base: '/!base',
        display: '/!display',
        front: '/!front'
    }
    var mime = {
        js: 'application/x-javascript',
        css: 'text/css',
        html: 'text/html'
    }
    var filePath = url;
    var ct = 'text/html';
    if (url == '/' || url == enter.base) {
        filePath = 'client/base/base.html';
    } else if (url == enter.display) {
        filePath = 'client/display/display.html';
    } else if (url == enter.front) {
        filePath = 'client/front/front.html';
    } else { //其他正常路径的js css html
        if (url == '/favicon.ico' || url == '/socket.io/socket.io.js') {
            url = '';
            res.end('');
        } else {
            var fileType = url.split('.')[1];
            filePath = filePath.substr(1, filePath.length);
            ct = mime[fileType];
        }
    }
    if (url != '') {
        ct = ct + ';charset=utf-8';
        console.log(filePath);
        fs.readFile(filePath, 'utf8', function (err, data) {
            res.writeHead(200, {'Content-Type': ct});
            res.write(data);
            res.end();
        });
    }

}


exports.sf = staticFile;