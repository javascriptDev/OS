/**
 * Created by a2014 on 14-6-23.
 */


//终端类型
var role = {
    //显示设备
    monitor: 'monitor',
    //记账
    base: 'base',
    //终端，点菜器
    terminal: 'terminal'
}

//连接到服务器的成员
var member = [];
//事件类型
var event = {
    addDesk: 'addDesk'

}
function addEvent(io) {
    io.on('connection', function (socket) {
        socket.on(event.login, function (member) {
            i, socket.join(member.role);

        })
        socket.on(event.addDesk, function (member) {

            io.sockets.in(member.role).emit(event.addDesk, member.desk);

        });


    });

}


exports.addEvent = addEvent;