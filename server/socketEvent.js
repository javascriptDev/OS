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
    pay: 'pay',
    changeList: 'changeList',
    oneOk: 'oneok'
}
var status = {
    begin: 'begin',
    made: 'made',
    end: 'end'
}

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

//缓存中才查找数据
function findDataById(id) {
    var d = {};
    for (var i = 0; i < cache.begin.length; i++) {
        if (cache.begin[i]._id == id) {
            d = cache.begin[i];
            break;
        }
    }
    return d;
}

//当厨房做好一个菜后。
function updateOrder(id, name, fn) {
    var result = findDataById(id);
    var hasData = false;
    var data = result.data && result.data.list || [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].text == name) {
            data[i].statues = 'made';
            break;
        }
    }
    data.length > 0 && (hasData = true);
    fn && fn(null, hasData);

}

//当 菜单发生变化时候
function updateOrderList(id, data, fn) {
    var result = findDataById(id);
    var hasData = false;
    var d = result.data && result.data.list;
    if (d) {
        hasData = true;
        for (var i = 0; i < data.length; i++) {
            var obj = data[i];
            if (obj.type == 'add') {
                d.push(obj);
            } else if (obj.type == 'del') {
                for (var j = 0; j < d.length; j++) {
                    var obj1 = d[j];
                    if (obj1.text == obj.text) {
                        d.splice(j, 1);
                        break;
                    }
                }
            }
        }
    }
    fn && fn(hasData);
}

function updateStatues(id) {


}

function addEvent(io) {
    io.on('connection', function (socket) {
            //登陆
            socket.on(event.login, function (member) {
                socket.join(member.role);
                allMember.push(member);
                io.emit(event.loginSuccess, {
                    success: true,
                    id: member.id
                });
//                socket.emit(event.addDesk, deskArr)
            });
            //前端点餐
            socket.on(event.addDesk, function (desk) {
                db.add('order', desk, function (err, data) {
                    if (!err) {
                        var a = [role.base, role.monitor];
                        a.forEach(function (item) {
                            io.sockets.in(item);
                        })
                        io.sockets.emit(event.addDesk, data[0]);
                    } else {
                        io.sockets.emit(event.addDesk, err);
                    }
                });

            });
            //后厨按照菜单 制作好
            function makeOver(data, id, fn) {
                db.update('order', function (err, d) {
                    fn && fn(err, d);
                }, data, {"_id": new ObjectId(id)});
            }

            //付款
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
                    } else {
                        io.sockets.emit(event.pay, err);
                    }
                }, {"_id": new ObjectId(id)});
            })
            //中途修改菜单
            socket.on(event.changeList, function (data) {
                var id = new ObjectId(data.id);
                io.sockets.in(role.base);
                io.sockets.in(role.monitor);
                db.query('order', function (err, d) {
                    if (!err) {
                        var list = d[0].data.list;
                        data.data.forEach(function (item) {
                            if (item.type == 'add') {
                                list.push(item);
                            } else if (item.type == 'del') {
                                for (var i = 0; i < list.length; i++) {
                                    var obj = list[i];
                                    if (obj.text == item.text) {
                                        list.splice(i, 1);
                                        break;
                                    }
                                }
                            }
                        })
                        db.update('order', function (err, d) {
                            if (!err) {
                                console.log(data);
                                io.sockets.emit(event.changeList, {id: id, success: true, data: data.data});
                            } else {
                                io.sockets.emit(event.changeList, err);
                            }
                        }, d[0], {"_id": id});
                    } else {
                        io.sockets.emit(event.changeList, err);
                    }

                }, {"_id": id});
            })
            //一道菜制作完毕,同步消息
            socket.on(event.oneOk, function (data) {
                var id = data.id,
                    text = data.text,
                    isOver = data.isOver;

                db.query('order', function (err, result) {
                    if (!err) {
                        var dd = result[0].data.list;
                        for (var i = 0; i < dd.length; i++) {
                            var o = dd[i];
                            if (o.text == text && o.statues != 'made') {//防止重样菜
                                result[0].data.list[i].statues = 'made';
                                break;
                            }
                        }
                        db.update('order', function (err, d) {
                            if (!err) {
                                io.sockets.in(role.monitor);
                                io.sockets.in(role.base);
                                data.stautes = 'made';
                                io.sockets.emit(event.oneOk, {success: true, one: data});
                                if (isOver) {
                                    result[0].statues = 'made';
                                    makeOver(result[0], id, function (err) {
                                        if (!err) {
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
                                            io.sockets.in(role.monitor);
                                            io.sockets.in(role.base);
                                            io.sockets.emit(event.makeOver, result)
                                        } else {
                                            io.sockets.in(role.monitor);
                                            io.sockets.emit(event.makeOver, err);
                                        }
                                    });
                                }

                            } else {
                                io.sockets.in(role.monitor);
                                io.sockets.emit(event.oneOk, {success: false, msg: err});
                            }
                        }, result[0], {"_id": new ObjectId(id)});

                    } else {
                        io.sockets.emit(event.oneOk, {success: false, msg: 'no data'});
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