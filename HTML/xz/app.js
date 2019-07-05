const express=require('express');
//引入user路由器
const userRouter=require('./routes/user.js');
//引入product路由器
const productRouter=require('./routes/product.js');
//引入api路由器
const apiRouter=require('./routes/api.js');
//引入mypro路由器
const myproRouter=require('./routes/mypro.js');
//引入body-parser中间件
const bodyParser=require('body-parser');
var app=express();
app.listen(8080);

//托管静态资源到public目录下
app.use( express.static('public') );
app.use( express.static('ajax') );
app.use( express.static('mypro') );

//使用body-parser中间件
app.use(bodyParser.urlencoded({
	extended:false //不是第三方的qs模块，而是使用querystring模块
}));

//使用路由器
app.use('/user',userRouter);
app.use('/product',productRouter);
app.use('/api',apiRouter);
app.use('/mypro',myproRouter);