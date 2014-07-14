/**
 * Created by addison on 14-6-20.
 *
 * Server(静态文件 + web services + web socket server);
 */
var http = require('http');
var sf = require('./staticFile').sf;
var ws = require('./webServices').ws;
var se = require('./socketEvent');


var server = http.createServer(function (req, res) {
    //console.log(req.socket.remoteAddress);
    var url = req.url;
    if (url.indexOf('!ws') != -1) {//web services
        ws(req, res);
    } else {
        //static file
        sf(req, res);
    }
});
server.listen(8000, null);

//挂 web socket
var io = require('socket.io').listen(server);
se.addEvent(io);
