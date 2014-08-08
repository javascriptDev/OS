/**
 * Created by a2014 on 14-8-8.
 */
var client = require('mongodb').MongoClient;

var address = 'mongodb://127.0.0.1:27017/test';


var dbm;
var table = 'a';
var query = {
    //db.inventory.find( { type: { $in: [ 'food', 'snacks' ] } } )
    between: {field: { $in: []}},
    //db.inventory.find( { type: 'food', price: { $lt: 9.95 } } )
    and: {field: 1, field: 2},
//    db.inventory.find(
//    {
//        $or: [ { qty: { $gt: 100 } }, { price: { $lt: 9.95 } } ]
//    })
    or: { $or: [
        {field: {$gt: 100}},
        {field: {$lt: 1}}
    ]},
//    db.inventory.find( { ratings: { $elemMatch: { $gt: 5, $lt: 9 } } } )
    match: {field: {$elemMatch: {}}},// 全匹配
    //limit field return
//    db.inventory.find( { type: 'food' }, { item: 1, qty: 1 } )

}

var update = {

    //    db.bios.update(
    //    { _id: 4, "awards.by": "ACM"  } ,
    //    { $set: { "awards.$.by": "Association for Computing Machinery" } })
    updateList: '',
    //    db.bios.update(
    //    { _id: 1 },
    //    {
    //        $push: { awards: { award: "IBM Fellow", year: 1963, by: "IBM" } }
    //    }
    //)
    addElement: '',
    //    db.people.update(
    //    { name: "Andy" },
    //    {
    //        name: "Andy",
    //        rating: 1,
    //        score: 1
    //    },
    //    { upsert: true }
    //)
    upsert: 'is not object name is Andy,then create a new ',
    //    db.books.update(
    //    { item: "Divine Comedy" },
    //    {
    //        $set: { price: 18 },
    //        $inc: { stock: 5 }
    //    }
    //)
    setAndinc: 'add a price field to the document and increments the stock by 5',
    //    db.books.update(
    //    { stock: { $lt: 5 } },
    //    { $set: { reorder: true } },
    //    { multi: true }
    //)
    multi: ' add new field reorder to all document which stock lt than 5',
    //    db.bios.update(
    //    { _id: 3, "contribs": "compiler" },
    //    { $set: { "contribs.$": "A compiler" } }
    //)
    updateArray: 'query the bios collection for the first document where _id==3 and the array contribs contains an element ==compiler,' +
        'if contains,the update() this first matching element in a array to A compiler in the document',
    //    db.bios.update(
    //    { _id: 1 },
    //    {
    //        $push: { awards: { award: "IBM Fellow", year: 1963, by: "IBM" } }
    //    }
    //)
    addArray: 'push a o to list'
}



function find() {
    client.connect(address, function (err, db) {
        if (!err) {
            db.collection(table).find().toArray(function (err, data) {
                console.log(data);
            })
        } else {
        }
    })
}

var a = 'a=[1,2,3,4]';


find();


//query:

