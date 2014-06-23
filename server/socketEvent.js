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
var allMember = [];
//事件类型
var event = {
    addDesk: 'addDesk',
    login: 'login',
    loginSuccess: 'ls'

}
function addEvent(io) {
    io.on('connection', function (socket) {
        socket.on(event.login, function (member) {
            socket.join(member.role);
            allMember.push(member);
            io.emit(event.loginSuccess, {
                success: true,
                id: member.id
            });
        })

        socket.on(event.addDesk, function (desk) {
            console.log('addDesk');
            console.log(desk);
            var a = [role.base, role.display];
            io.sockets.in(a).emit(event.addDesk, desk);
        });
    });
    a

    io.on('disconnect', function (reason) {



    });

}


exports.addEvent = addEvent;