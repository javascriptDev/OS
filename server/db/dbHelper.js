/**
 * Created by a2014 on 14-6-23.
 */

var client = require('mongodb').MongoClient;

var address = 'mongodb://127.0.0.1:27017/os';

//var a = {
//    dbName: 'os',
//    collections: [
//        {
//            name: 'order'
//        }
//
//    ]
//}


function add(table, data, fn) {
    client.connect(address, function (err, db) {
        db.collection(table).insert(data, function (err, result) {
            fn && fn(err, result);
            db.close();
        })
    })
}
function update(table, where, data, fn) {
    client.connect(address, function (err, db) {
        db.collection(table).update(where, data, function (err, result) {
            fn && fn(err, result);
            db.close();
        })
    })
}

function del(table, where, fn) {
    client.connect(address, function (err, db) {
        db.collection(table).remove(where, {w: 1}, function (err, result) {
            fn && fn(err, result);
            db.close();
        })
    })
}

function select(table, fn, where) {

    client.connect(address, function (err, db) {
        var col = db.collection(table);
        col.find(where || {}).toArray(function (err, result) {
            fn && fn(err, result);
            db.close();
        })
    })
}
var db = {
    insert: add,
    del: del,
    update: update,
    query: select
};

exports.help = db;


