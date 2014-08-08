/**
 * Created by addison on 14-6-23.
 *
 * 数据库操作
 * add
 * del
 * update
 * remove
 */

var client = require( 'mongodb' ).MongoClient;

var address = 'mongodb://127.0.0.1:27017/os';

function add( table, data, fn ) {
	client.connect( address, function( err, db ) {
		db.collection( table ).insert( data, function( err, result ) {
			fn && fn( err, result );
			db.close();
		} )
	} )
}
function update( table, fn, data, where ) {
	client.connect( address, function( err, db ) {
		db.collection( table ).update( where, data, function( err, result ) {
			fn && fn( err, result );
			db.close();
		} )
	} )
}

function del( table, fn, where ) {
	client.connect( address, function( err, db ) {
		db.collection( table ).remove( where || {}, {w: 1}, function( err, result ) {
			fn && fn( err, result );
			db.close();
		} )
	} )
}

function select( table, fn, where ) {

	client.connect( address, function( err, db ) {
		var col = db.collection( table );
		col.find( where || {} ).toArray( function( err, result ) {
			//   console.log(result);
			fn && fn( err, result );
			db.close();
		} )
	} )
}
function queryAndUpdata( table, data, fn, where ) {
	client.connect( address, function( err, db ) {
		var col = db.collection( table );
		col.findAndModify( where || {}, [], data, [], function( err, data ) {
			fn && fn( err, result );
			db.close();
		} )
	} )
}

var db = {
	add: add,
	del: del,
	update: update,
	query: select,
	queryAndModify: queryAndUpdata
};

exports.help = db;



