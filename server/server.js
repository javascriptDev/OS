/**
 * Created by a2014 on 14-6-20.
 */
var http = require('http');

var sf = require('./staticFile');
var ws = require('./webServices');
var se = require('./socketEvent');


var server = http.createServer(function (req, res) {
    var url = req.url;
    if (url.indexOf('#ws') != -1) {//static file
        ws.ws(res);
    } else {
        sf.getStaticFile(req, res);
    }


});
server.listen(8000, null);

var io = require('socket.io').listen(server);
se.addEvent(io);
