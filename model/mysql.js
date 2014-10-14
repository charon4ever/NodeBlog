// mysql.js

var mysql = require('mysql'),
	db_config = {
		host: 'localhost',
		port: '3306',
		user: 'root',
		password: 'admin',
		database: 'NodeBlog'
	},
	connection;

// 数据库连接
function handleDiscount () {
	connection = mysql.createConnection(db_config);

	connection.connect(function ( err ) {
		if ( err ) {
			console.log('进行断线重连...' + new Date());
			setTimeout(handleDiscount(), 10000);
			return;
		}
		console.log('连接成功');
	});

	connection.on('error', function ( err ) {
		console.log('ERROR!' + err);
		if ( err.code == 'PROTOCOL_CONNECTION_LOST' ) {
			handleDiscount();
		} else {
			throw err;
		}
	});
}

handleDiscount();


function DB () {

}


// test
DB.prototype.sayHi = function () {
	return 'Hi! I`m DB!';
}


// 数据库查询
// fields 查询的字段
// table 查询的表
// callback 回调函数
DB.prototype.query = function ( sql, callback ) {
	connection.query( sql, function ( err, results ) {
		if ( err ) {
			throw err;
		}
		callback( results );
		// console.log(results);
	});
};


// 数据库查询ById
// fields 查询的字段
// table 查询的表
// callback 回调函数
/*DB.prototype.queryById = function ( fields, table, id, callback ) {
	connection.query('SELECT '+ fields +' FROM '+ table +' WHERE id = '+ id,  function ( err, results ) {
		if ( err ) {
			throw err;
		}
		callback( results );
	});
};*/


// 数据库修改
DB.prototype.update = function ( sql ) {
	console.log( sql );
	// console.log( fields );
	// connection.query('UPDATE '+ table +' SET uname = ?, email = ?, description = ? WHERE id = '+ id, fields, function ( err, results ) {
	connection.query( sql, function ( err, results ) {
		if ( err ) {
			throw err;
		}
		// callback( results );
		// console.log(results);
	});
};


// 添加数据
DB.prototype.insert = function ( sql ) {
	connection.query( sql, function ( err, results ) {
		if ( err ) {
			throw err;
		}
	});
};


// 删除数据
DB.prototype.delete = function ( sql ) {
	connection.query( sql, function ( err, results ) {
		if ( err ) {
			throw err;
		}
	});
}

module.exports = new DB();