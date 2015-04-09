# NodeBlog

基于Bootstrap+AngularJS+Express+MongoDB的一个博客系统

## 功能及特征

基础功能

+ 发表文章

+ 更新文章

+ 删除文章

特性

+ 使用Markdown创作

+ 自动保存

## 环境配置

### 安装Node.js及MongoDB

要运行项目，我们首先需要配置Node.js环境，安装MongoDB数据库，这里只提供下载地址，具体安装过程可以参考官方文档或者自己去google

安装Nodejs，[下载地址](https://nodejs.org/download/)

安装mongodb数据库，[下载地址](https://www.mongodb.org/downloads)

查看版本及测试安装是否成功(安装路径不同可能命令不同，最好让他们能够全局执行)

```
npm --version && node --version && mongo --version
```

### 安装Node依赖包

进入项目根目录，安装依赖包，运行：

```
npm install
```

## 配置项目及运行项目

从项目根目录进入bin文件夹下，找到www文件，根据需要修改端口号，默认为3000

```
...
app.set('port', process.env.PORT || 3000); // 3000为默认端口号
...
```

运行项目

```
npm start
```

然后访问[http://127.0.0.1:3000](http://127.0.0.1:3000)即可




MIT
