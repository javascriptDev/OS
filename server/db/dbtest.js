/**
 * Created by a2014 on 14-6-23.
 */

var db = require('./dbHelper').help;


var tn = 'order';
function addData() {
    db.insert(tn, {name: 1, age: 2}, function (err, result) {
        console.log(result);
    });
}

function getData(where) {
    db.query(tn, function (err, data) {
        console.log(data);
    }, where)
}

function deleteData(where) {
    db.del(tn, where, function (err, result) {
        console.log(result);
    })
}
addData({name: 111, age: 234234});