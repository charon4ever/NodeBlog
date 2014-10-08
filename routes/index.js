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
	DB.query(function ( results ) {
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

//编辑用户
router.get('/admin-user-edit', function ( req, res ) {
	res.render('admin-user-edit', {
		title: '编辑用户'
	});
});


module.exports = router;
