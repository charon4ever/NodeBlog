var express = require('express');
var router = express.Router();


var DB = require('../model/mysql');

console.log(DB.sayHi());

/*DB.query(function ( results ) {
	console.log(results);
});*/


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'NodeBlog' });
});

router.get('/login', function ( req, res ) {
	res.render('login', { title: '登录' });
});



/*
	admin
*/
router.get('/admin-index', function ( req, res ) {
	// req.setEncoding('utf-8');
	DB.query( 'SELECT * FROM user', function ( results ) {
		res.render('admin-index', {
			title: 'NodeBlog后台管理',
			entry: results
		});
	});
});


//添加用户
router.get('/admin-user-new', function ( req, res ) {
	res.render('admin-user-new', {
		title: '添加用户'
	});
});


// 编辑用户 -- 编辑页面
router.get('/admin-user-edit', function ( req, res ) {
	// console.log(req.query.id);
	DB.query( 'SELECT * FROM user WHERE id = ' + req.query.id, function ( results ) {
		res.render('admin-user-edit', {
			title: '编辑用户',
			entry: results[0]
		});
	});
});


// 用户中心
router.get('/admin-user-center', function ( req, res ) {
	// console.log(req.query);
	DB.query( 'SELECT * FROM user WHERE id = ' + req.query.id, function ( results ) {
		res.render('admin-user-center', {
			title: '用户中心',
			entry: results[0]
		});
	});
});

// 编辑用户 -- 执行编辑
router.post('/admin-user-edit', function ( req, res ) {
	// console.log(req.body);
	// DB.update('user', [req.body.nikename, req.body.email, req.body.description], req.body.id);
	DB.update('UPDATE user SET uname = "' + req.body.nikename + '", email = "' + req.body.email + '", description = "' + req.body.description + '" WHERE id = ' + req.body.id );
	DB.query( 'SELECT * FROM user WHERE id = ' + req.body.id, function ( results ) {
		res.render('admin-user-center', {
			title: '操作成功!',
			entry: results[0]
		});
	});
});


module.exports = router;
