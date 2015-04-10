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
    id: int,
    uname: String,
    password: String,
    email: String,
    description: String
});

var UserModel = mongoose.model('User', User);
