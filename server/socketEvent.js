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
    loginSuccess: 'ls',
    makeOver: 'mo'
}

//所有餐桌的订单
var deskArr = [];
//制作完成菜单的desk
var overDesk = [];
function addEvent(io) {
    io.on('connection', function (socket) {
            console.log(io.sockets.sockets.length);

            //登陆
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
            });

            //前端点餐
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

            //后厨按照菜单 制作好
            socket.on(event.makeOver, function (data) {
                var id = data.id;
                deskArr.forEach(function (item, index) {
                    if (item.id == id) {
                        overDesk.push(data);
                        deskArr.splice(index, 1);
                    }
                })
                io.sockets.in(role.monitor);
                io.sockets.emit(event.makeOver, {
                    success: true,
                    id: id
                })
            });

            socket.on('disconnect', function (a) {
                var a = '';
                //客户端socket 断开，需要手动 从io中删除备份的socket
            });
        }
    )
}


exports.addEvent = addEvent;