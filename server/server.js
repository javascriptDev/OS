/**
 * Created by a2014 on 14-6-20.
 */
var http = require('http');
var sf = require('./staticFile').sf;
var ws = require('./webServices').ws;
var se = require('./socketEvent');


var server = http.createServer(function (req, res) {

    var url = req.url;
    if (url.indexOf('#ws') != -1) {//static file
        ws(res);
    } else {
        sf(req, res);
    }
});
server.listen(8000, null);

var io = require('socket.io').listen(server);
se.addEvent(io);
