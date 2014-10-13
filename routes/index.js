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
	// req.session.views = 1;
	// console.log( req.session.views );
	console.log( 'Cookies:' + req.cookies );
	console.log( 'Sessions:' + req.session );
	res.render('login', { title: '登录' });
});



/*
	folder Test
	==============================
*/
router.get('/foldertest/test', function ( req, res ) {
	res.render('foldertest/test', {
		title: 'folder test!'
	});
});



/*
	admin
	=============================
*/
router.get('/admin', function ( req, res ) {
	// req.setEncoding('utf-8');

	// console.log( req.query );

	if ( req.query.action == 'delete' ) {
		// console.log('删除数据!');
		// console.log(req.query.id);
		DB.delete('DELETE FROM user WHERE id = ' + req.query.id);
		res.render('admin/success', {
			title: '操作成功!'
		});

	} else {
		DB.query( 'SELECT * FROM user', function ( results ) {
			res.render('admin/', {
				title: 'NodeBlog后台管理',
				entry: results
			});
		});
	}
});


// 删除用户
/*router.get('/admin-index', function ( req, res ) {
	// DB.delete();
	console.log(req.query.id);
	console.log(req.query.action);
	res.render('admin-index', {
		title: 'NodeBlog后台管理',
		entry: results
	});
});*/


// 搜索
router.post('/admin', function ( req, res ) {
	console.log( req.body.action );
	console.log( req.body.keywords );
	DB.query('SELECT * FROM user WHERE uname like "%'+ req.body.keywords +'%" or email like "%'+ req.body.keywords +'%"', function ( results ) {
		res.render('admin/', {
			title: 'NodeBlog后台管理',
			entry: results
		});
	});
});


// 添加用户
router.get('/admin/user-new', function ( req, res ) {
	res.render('admin/user-new', {
		title: '添加用户'
	});
});


// 添加用户 - 执行添加
router.post('/admin/user-new', function ( req, res ) {
	console.log(req.body);
	DB.insert( 'INSERT INTO user(uname, email, description) VALUES("' + req.body.nikename + '", "' + req.body.email + '", "' + req.body.description + '")' );
	res.render('admin/success', {
		title: '操作成功!'
	});
});


// 用户中心
router.get('/admin/user-center', function ( req, res ) {
	// console.log(req.query);
	DB.query( 'SELECT * FROM user WHERE id = ' + req.query.id, function ( results ) {
		res.render('admin/user-center', {
			title: '用户中心',
			entry: results[0]
		});
	});
});


// 编辑用户 -- 编辑页面
router.get('/admin/user-edit', function ( req, res ) {
	// console.log(req.query.id);
	DB.query( 'SELECT * FROM user WHERE id = ' + req.query.id, function ( results ) {
		res.render('admin/user-edit', {
			title: '编辑用户',
			entry: results[0]
		});
	});
});


// 编辑用户 -- 执行编辑
router.post('/admin/user-edit', function ( req, res ) {
	// console.log(req.body);
	// DB.update('user', [req.body.nikename, req.body.email, req.body.description], req.body.id);
	DB.update('UPDATE user SET uname = "' + req.body.nikename + '", email = "' + req.body.email + '", description = "' + req.body.description + '" WHERE id = ' + req.body.id );
	DB.query( 'SELECT * FROM user WHERE id = ' + req.body.id, function ( results ) {
		res.render('admin/user-center', {
			title: '操作成功!',
			entry: results[0]
		});
	});
});


module.exports = router;
