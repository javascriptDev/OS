/**
 * Created by a2014 on 14-6-23.
 */
var fs = require('fs');
function staticFile(req, res) {
    var url = req.url;

    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    var f = 'client/base/index.html';

    fs.readFile(f, 'utf8', function (err, data) {
        res.write(data);
        res.end();
    });
}


exports.getStaticFile = staticFile;