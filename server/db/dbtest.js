/**
 * Created by addison on 14-6-23.
 */

var db = require('./dbHelper').help;


var tn = 'order';
function addData(data) {
    db.insert(tn, data, function (err, result) {
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

var help = {
    add: addData,
    select: getData,
    del: deleteData
}
exports.dbh = help