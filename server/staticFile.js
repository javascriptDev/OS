/**
 * Created by addison on 14-6-23.
 *
 * 请求静态文件处理函数
 * 类型:
 *
 * html
 * js
 * css
 * image - [bmp,png,jpg,jpeg,gif]
 *
 *
 */
var fs = require('fs');


function staticFile(req, res) {
    var url = req.url;
    var enter = {
        base: '/!b',
        display: '/!d',
        front: '/!f',
        login: '/!l'
    }
    var mime = {
        js: 'application/x-javascript',
        css: 'text/css',
        html: 'text/html',
        png: 'image/png',
        gif: 'image/gif',
        jpeg: 'image/jpeg',
        bmp: 'image/bmp',
        jpg: 'image/jpg'
    }

    var cache = [];

    var filePath = url;
    var ct = 'text/html';
    if (url == enter.base) {
        filePath = 'client/base/base.html';
    } else if (url == enter.display) {
        filePath = 'client/display/display.html';
    } else if (url == enter.front) {
        filePath = 'client/front/front.html';
    } else if (url == '/' || url == enter.login) {
        filePath = 'client/login.html';
    } else { //其他正常路径的js css html
        var fileType = filePath.split('.')[1];
        if (url == '/socket.io/socket.io.js') {
            //排除 socket.io.client
            filePath = '';
            res.end('');
        } else {//js css html image
            filePath = filePath.substr(1, filePath.length);
            ct = mime[fileType];
        }
    }

    if (filePath != '') {
        ct = ct + ';charset=utf-8';
        //console.log(filePath);
        //     console.log(filePath);
        fs.exists(filePath, function (a) {
            if (a) {
                fs.readFile(filePath, function (err, data) {
                    res.writeHead(200, {'Content-Type': ct});
                    res.write(data, 'binary');
                    res.end();
                });
            } else {
                res.end("not resource");
            }
        })
    }
}
exports.sf = staticFile;