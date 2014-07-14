/**
 * Created by a2014 on 14-7-2.
 */

var db = require('./dbHelper').help;

db.del('order', function () {
    console.log('del success');
}, {});