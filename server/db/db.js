/**
 * Created by addison on 14-6-23.
 *
 * 创建数据库
 *
 *
 */
var Db = require('mongodb').Db,
    Server = require('mongodb').Server;

var mongodb = require('mongodb');
var server = new Server('127.0.0.1', 27017, {auto_reconnect: true});


function createDB(dbName, collections) {
    var db = new mongodb.Db(dbName, server, {safe: true});
    db.open(function (err, db) {
        if (!err) {
            collections.forEach(function (item) {
                db.createCollection(item, {safe: true}, function (err, collection) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('create table ' + item + ' success');
                    }

                })
            })

        } else {
            console.log(err);
        }
        db.close();
    })
}

function delDb(dbName) {

}









