/**
 * Created by addison on 14-6-23.
 * 处理  web socket 请求 handler
 *
 * --------- 客户端角色:-------------
 *                                  *
 *  monitor   :  用于显示数据的终端    *
 *  base      :  用于数据统计的终端    *
 *  terminal  :  用户点菜的终端       *
 *                                  *
 * ---------------------------------
 *
 * --------监听的socket 事件类型----------------------
 *                                                  *
 * addDesk       :  下菜单事件                        *
 * login         :  所有终端登录事件(身份验证)          *
 * loginSuccess  :  登录身份验证成功,分发消息           *
 * makeOver      :  厨房根据菜单，制作菜品完成事件       *
 *                                                  *
 * -------------------------------------------------
 *
 */
var db = require('./db/dbHelper').help;
var ObjectId = require('mongodb').ObjectID;


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
    makeOver: 'mo',
    pay: 'pay'
}
var status = {
    begin: 'begin',
    made: 'made',
    end: 'end'
}

//所有餐桌的订单
var deskArr = [];
//制作完成菜单的desk
var overDesk = [];
function newGuid() {
    var guid = "a";
    for (var i = 1; i <= 31; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "-";
    }

    return guid;
}
function addEvent(io) {
    io.on('connection', function (socket) {
            //  console.log(io.sockets.sockets.length);

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
                db.add('order', desk, function (err, data) {
                    if (!err) {
                        desk.id = data[0]._id;
                        deskArr.push(desk);
                        var a = [role.base, role.monitor];
                        a.forEach(function (item) {
                            io.sockets.in(item);
                        })
                        console.log(desk);
                        io.sockets.emit(event.addDesk, desk);
                    } else {
                        io.sockets.emit(event.addDesk, error);
                    }
                });


            });

            //后厨按照菜单 制作好
            socket.on(event.makeOver, function (data) {
                var id = data.id;
                deskArr.forEach(function (item, index) {
                    if (item.id == id) {
                        item.statues = 'made';
                        db.update('order', function (err, data) {
                            var result = {
                                success: true,
                                id: id,
                                data: {
                                    statues: 'made'
                                }
                            };
                            if (err) {
                                result = err;
                            }
                            deskArr.splice(index, 1);
                            io.sockets.in(role.monitor);
                            io.sockets.in(role.base);
                            io.sockets.emit(event.makeOver, result)
                        }, item, {"_id": new ObjectId(id)});
                    }
                })

            });

            socket.on(event.pay, function (id) {
                db.query('order', function (err, data) {
                    //data is a array
                    if (!err) {
                        data[0].statues = status.end;
                        db.update('order', function (err, d) {
                            var result = {
                                success: true,
                                id: id,
                                dn: data[0].dn
                            }
                            if (err) {
                                result = err;
                            }
                            io.sockets.in(role.monitor);
                            io.sockets.in(role.base);
                            io.sockets.emit(event.pay, result);

                        }, data[0], {"_id": new ObjectId(id)});
                    }
                }, {"_id": new ObjectId(id)});
            })

            socket.on('disconnect', function (a) {
                var a = '';
                //客户端socket 断开，需要手动 从io中删除备份的socket
            });
        }
    )
}


exports.addEvent = addEvent;