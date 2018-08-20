var express = require('express');    				 //引入express
var exphbs = require('express-handlebars'); 		 //引入express-handlebars
var path = require('path');
var app = express();
//使用模板引擎
app.engine('.html', exphbs({
  partialsDir: 'views/include',  //公用部分
  extname: '.html' 		    //后缀名为.html
}));
app.set('views', __dirname + '/views');   		//设置模板路径
app.set('views engine', '.html');
app.use(express.static(path.join(__dirname, 'public')));  //设置静态路径path.join(参数1,参数2)  参数1：当前文件位置的上级  参数2  文件名

app.get('/favicon.ico', function (req, res) {
  res.end();
});
app.get('/*', function (req, res) {
  res.render(req.params[0]);   		//req：http://localhost:3000/fact/index   req.params[0]:fact/index
});

app.listen(3000);  					//设置监听  端口为3000
console.log('server start successful on : 3000');

