// mysql.js

var mysql = require('mysql'),
	db_config = {
		host: 'localhost',
		port: '3306',
		user: 'root',
		password: 'admin',
		database: 'myNodeMysql'
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

DB.prototype.sayHi = function () {
	return 'Hi! I`m DB!';
}

DB.prototype.query = function ( callback ) {
	connection.query('SELECT * FROM user', function ( err, results ) {
		if ( err ) {
			throw err;
		}
		callback( results );
		// console.log(results);
	});
}

module.exports = new DB();