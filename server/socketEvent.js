/**
 * Created by a2014 on 14-6-23.
 */
var db = require('./db/dbtest').dbh;


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
var allMember = [];
//事件类型
var event = {
    addDesk: 'addDesk',
    login: 'login',
    loginSuccess: 'ls'

}

var deskArr = [];
function addEvent(io) {
    io.on('connection', function (socket) {
        socket.on(event.login, function (member) {
            socket.join(member.role);
            allMember.push(member);
            io.emit(event.loginSuccess, {
                success: true,
                id: member.id
            });
            if (deskArr.length > 0) {
                socket.emit(event.addDesk, deskArr)
            }
        })

        socket.on(event.addDesk, function (desk) {
            desk.id = Math.random() * 1909;
            deskArr.push(desk);
            //  db.add(desk.data);
            var a = [role.base, role.monitor];
            a.forEach(function (item) {
                io.sockets.in(item);
            })
            io.sockets.emit(event.addDesk, desk);
        });
    });
    io.on('disconnect', function (reason) {

    });

}


exports.addEvent = addEvent;