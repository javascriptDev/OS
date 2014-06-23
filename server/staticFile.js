/**
 * Created by a2014 on 14-6-23.
 */
var fs = require('fs');

function staticFile(req, res) {
    var url = req.url;


    var enter = {
        base: 'base',
        display: 'display',
        front: 'front'
    }
    var filePath = '';
    if (url.indexOf(enter.base) != -1) {
        filePath = 'client/base/base.html';
    } else if (url.indexOf(enter.display) != -1) {
        filePath = 'client/display/display.html';
    } else if (url.indexOf(enter.front) != -1) {
        filePath = 'client/front/front.html';
    }
    if (url != '/favicon.ico') {
        fs.readFile(filePath, 'utf8', function (err, data) {
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
            res.write(data);
            res.end();
        });
    }
}


exports.getStaticFile = staticFile;