
var express = require('express');
var router = express.Router();






/**
* ------------------------------ 
* MongoDB
* ------------------------------ 
*/


var mongoose = require('mongoose');


// 数据库连接
mongoose.connect('mongodb://localhost/NodeBlog');


// 通过Schema创建数据库
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


// 数据表 post
var Post = new Schema({
    author: ObjectId,
    title:  String,
    summary: String,
    content: String,
    data: Date
});

var PostModel = mongoose.model('Post', Post);


// 数据表 user
var User = new Schema({
    id: String,
    uname: String,
    password: String,
    email: String,
    description: String
});

var UserModel = mongoose.model('User', User);






// 登录验证
function authorize ( req, res, next ) {
	if ( !req.session.userid ) {
		res.redirect('/signin');
	} else {
		next();
	}
}




/**
* -----------------------------------
* 首页 index.jade
* GET
* -----------------------------------
*/
router.get('/', function(req, res) {
    PostModel.find(function ( err, posts ) {
        if (!err) {
			res.render('index', {
				title: 'NodeBlog',
				entry: posts
			});            
        } else {
            return console.log( err );
        }
    });
});




/**
* -----------------------------------
* 登录页面 signin.jade
* GET -- 已经登录 ? 后台列表页 : 登录页
* -----------------------------------
*/
router.get('/signin', function ( req, res ) {
	if ( !req.session.userid ) {
		res.render('signin', { title: '登录' });
		// res.redirect('/login');
	} else {
		res.redirect('admin/');
	}
});




/**
* -----------------------------------
* 登录处理 signin.jade
* POST -- 登录成功 ? 后台列表页 : 登录页
* -----------------------------------
*/
router.post('/signin', function ( req, res ) {
	UserModel.find({
		'uname': req.body.username,
		'password': req.body.password
	}, function ( err, user ) {
		console.log( err );
		console.log( user );
		if ( !err ) {
			if ( user.length == 1 ) {
				req.session.userid = user[0]._id;
				res.redirect('admin/');					
			} else {
				res.redirect('/signin');			
			}
		} else {
			console.log(err);
		}
	});
});



/**
* -----------------------------------
* 退出登录 logout.jade
* GET -- 销毁session, 跳转到登录页
* -----------------------------------
*/
router.get('/admin/logout', function ( req, res ) {
	req.session.destroy();
	res.redirect('/signin');
});



/**
* -----------------------------------
* 注册页面 signup.jade
* GET -- 已登录 ？ 列表页 ： 注册页
* -----------------------------------
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




/**
* -----------------------------------
* 注册处理 signup.jade
* POST -- 首先验证用户名是否合法、是否重复， 然后验证密码是否合法， 两次密码是否一致
*      -- 如果无误， 则跳转到操作成功页， 否则跳转到注册页
* -----------------------------------
*/
router.post('/signup', function ( req, res ) {

    var user = new UserModel({
        uname: req.body.username,
        password: req.body.password1
    });

    user.save(function ( err ) {
        if (!err) {
            console.log('created');
            res.redirect('/admin/success');
        } else {
            console.log(err);
            res.redirect('/signup');
        }
    });
});




/**
* -----------------------------------
* 关于 about.jade
* GET
* -----------------------------------
*/
router.get('/about', function ( req, res ) {
	res.render('about', {
		title: 'About Page'
	});
});




/**
* -----------------------------------
* 联系 contact.jade
* GET
* -----------------------------------
*/
router.get('/contact', function ( req, res ) {
	res.render('contact', {
		title: 'Contact Page'
	});
});


/**
* -----------------------------------
* admin admin/index.jade
* GET -- 已登录 ? 文章管理列表 : 登录页面
* GET -- 根据action传递的参数，决定是执行删除还是搜索
* -----------------------------------
*/
router.get('/admin', authorize, function ( req, res ) {
	
	if ( req.query.action == 'delete' ) {
		UserModel.findById( req.query.id, function ( err, user ) {
			if ( !err ) {
				if ( user._id == req.query.id ) {
					user.remove(function ( err ) {
						if ( !err ) {
							res.render('admin/success', {
								title: '操作成功!'
							});
						} else {
							console.log( err );							
						}
					});
				}
			} else {
				console.log( err );
			}
		});
	} else if ( req.query.action == 'search' ) {
		var re = new RegExp('^.*' + req.query.keywords + '.*$', 'i');
		UserModel.find({"description": re}, function ( err, user ) {
			console.log(user);
			if ( !err ) {
				res.render('admin/', {
					title: 'NodeBlog后台管理',
					entry: user
				});
			} else {
				console.log( err );
			}
		});
	} else {
		UserModel.find(function ( err, users ) {
			res.render('admin/', {
				title: 'NodeBlog后台管理',
				entry: users
			});
		});
	}

});




/**
* -----------------------------------
* 添加用户 admin/user-new.jade
* GET -- 已经登录 ? 添加用户页面 : 登录页
* -----------------------------------
*/
router.get('/admin/user-new', authorize, function ( req, res ) {
	res.render('admin/user-new', {
		title: '添加用户'
	});
});



/**
* -----------------------------------
* 添加用户 admin/user-new.jade
* POST -- 执行添加
* -----------------------------------
*/
router.post('/admin/user-new', function ( req, res ) {

	var user = new UserModel({
		uname: req.body.nikename,
		email: req.body.email,
		description: req.body.description
	});

	user.save(function ( err ) {
		if ( !err ) {
			res.render('admin/success', {
				title: '操作成功!'
			});
		} else {
			console.log(err);
		}
	});

});




/**
* -----------------------------------
* 用户中心 admin/user-center.jade
* GET -- 已经登录 ? 用户中心页面 : 登录页
* -----------------------------------
*/
router.get('/admin/user-center', authorize, function ( req, res ) {
	UserModel.findById( req.query.id, function ( err, user ) {
		if ( !err ) {
			if ( user._id == req.query.id ) {
				res.render('admin/user-center', {
					title: '用户中心',
					entry: user
				});
			}
		} else {
			console.log( err );
		}
	});
});




/**
* -----------------------------------
* 编辑用户 admin/user-edit.jade
* GET -- 已经登录 ？ 编辑页面 : 登录页
* -----------------------------------
*/
router.get('/admin/user-edit', authorize, function ( req, res ) {
	UserModel.findById( req.query.id, function ( err, user ) {
		if ( !err ) {
			if ( user._id == req.query.id ) {
				res.render('admin/user-edit', {
					title: '编辑用户',
					entry: user
				});
			}
		} else {
			console.log( err );
		}
	});
});



/**
* -----------------------------------
* 编辑用户 admin/user-edit.jade
* POST -- 执行编辑
* -----------------------------------
*/
router.post('/admin/user-edit', function ( req, res ) {
	
	UserModel.findById( req.body.id, function ( err, user ) {
		user.uname = req.body.nikename;
		user.email = req.body.email;
		user.description = req.body.description;

		user.save(function ( err ) {
			if ( !err ) {
				res.render('admin/user-center', {
					title: '操作成功!',
					entry: user
				});		
			} else {
				console.log( err );
			}
		});
	});

});




/**
* -----------------------------------
* 操作成功页面 admin/success.jade
* GET
* -----------------------------------
*/
router.get('/admin/success', function ( req, res ) {
	res.render('admin/success', {
		title: '操作成功！'
	});
});


module.exports = router;
