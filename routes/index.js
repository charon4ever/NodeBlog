var express = require('express');
var router = express.Router();


// 登录验证
function authorize ( req, res, next ) {
	if ( !req.session.userid ) {
		res.redirect('/login');
	} else {
		next();
	}
}


var DB = require('../model/mysql');

console.log(DB.sayHi());

/*DB.query(function ( results ) {
	console.log(results);
});*/


/* GET home page. */
router.get('/', function(req, res) {
	// req.session.username = 'Gallop123';
	// console.log( req.cookies );
	// console.log('-----------------');
	// console.log( req.session );
	// req.session.destroy();
	// console.log( req.session );
	res.render('index', { title: 'NodeBlog' });
});


/*router.post('/', function () {
	req.session.username = 'Gallop';
	console.log( req.session.username );
});*/




/*
	登录页面
	已经登录 ? 后台列表页 : 登录页
*/
router.get('/login', function ( req, res ) {
	if ( !req.session.userid ) {
		res.render('login', { title: '登录' });
		// res.redirect('/login');
	} else {
		res.redirect('admin/');
	}
});


/*
	登录处理
	登录成功 ? 后台列表页 : 登录页
*/
router.post('/login', function ( req, res ) {
	DB.query('SELECT id FROM user WHERE uname = "' + req.body.username + '" and password = "' + req.body.password + '"', function ( results ) {
		// console.log( results[0] );
		if ( typeof results[0] == 'undefined' ) {
			res.redirect('/login');
		} else {
			req.session.userid = results[0].id;
			res.redirect('admin/');
		}
	});

});


/*
	退出登录
	销毁session, 跳转到登录页
*/
router.get('/admin/logout', function ( req, res ) {
	req.session.destroy();
	res.redirect('/login');
});


/*
	注册页面
	已登录 ？ 列表页 ： 注册页
*/
router.get('/signup', function ( req, res ) {
	if ( !req.session.userid ) {
		res.render('signup', {
			title: '注册'
		});
	} else {
		res.redirect('admin/');
	}
});


/*
	注册处理
	首先验证用户名是否合法、是否重复， 然后验证密码是否合法， 两次密码是否一致
	如果无误， 则跳转到操作成功页， 否则跳转到注册页
*/
router.post('/signup', function ( req, res ) {


/*	// 注册验证逻辑
	if ( req.body.username 用户名不合法 ) {
		//redirect
	} else if ( req.body.password1 != req.body.password2 ) {
		//redirect
		// 两次密码不一致
	} else if ( req.body.password2 密码不合法) {
		//redirect
	} else {
		// 检测用户名是否重复
	}*/

	DB.query('SELECT id FROM user WHERE uname = "' + req.body.username + '"', function ( results ) {
		if ( typeof results[0] == 'undefined' ) {
			//用户名不重复， 继续
			//req.body.username
			//req.body.password1
			DB.insert('INSERT INTO user(uname, password) VALUES("' + req.body.username + '", "' + req.body.password1+ '")');
			res.redirect('/admin/success');
		} else {
			console.log('用户名重复');
			//redirect 重新注册
			res.redirect('/signup');
		}
	});
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
router.get('/admin', authorize, function ( req, res ) {
// router.get('/admin', function ( req, res ) {
	// req.setEncoding('utf-8');

	// console.log( req.query );

/*	if ( req.session.username ) {
		console.log( '草' + req.session.username );
	} else {
		console.log('还木有登录哦!');
	}*/

	// authorize();

	// if ( req.session.username ) {
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
	// } else {
		// res.redirect('/login');
	// }

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


/*
	添加用户
	已经登录 ? 添加用户页面 : 登录页
*/
router.get('/admin/user-new', authorize, function ( req, res ) {
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


/*
	用户中心
	已经登录 ? 用户中心页面 : 登录页
*/
router.get('/admin/user-center', authorize, function ( req, res ) {
	// console.log(req.query);
	DB.query( 'SELECT * FROM user WHERE id = ' + req.query.id, function ( results ) {
		res.render('admin/user-center', {
			title: '用户中心',
			entry: results[0]
		});
	});
});


// 编辑用户 -- 编辑页面
/*
	用户信息编辑页面
	已经登录 ？ 编辑页面 : 登录页
*/
router.get('/admin/user-edit', authorize, function ( req, res ) {
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


// 操作成功页面
router.get('/admin/success', function ( req, res ) {
	res.render('admin/success', {
		title: '操作成功！'
	});
});


module.exports = router;
