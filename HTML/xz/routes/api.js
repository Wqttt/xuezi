const express=require('express');
//引入连接池模块
const pool=require('../pool.js');//上一级../，上两级../../
//创建路由器对象
var router=express.Router();
//添加路由
//1.ajax-demo
router.get('/ajaxDemo',(req,res)=>{
	console.log("ajaxDemo接口接收的请求");
	res.send("这是我的第一个ajax程序");
});
//2.myajax
router.get('/myajax',(req,res)=>{
	console.log("myajax接口接收的请求");
	res.send("这是我的第二个ajax程序");
});
//3.伪登录---后台获取前台传来的数据，不查数据
router.get("/v1/login",(req,res)=>{
	var obj=req.query;
	var $uname=obj.uname;
	var $upwd=obj.upwd;
	if(!$uname){
		res.send("用户名为空");
		return;
	}
	if(!$upwd){
		res.send("用户密码为空");
		return;
	}
	res.send($uname+","+$upwd);
	//查询数据库
});
//4.登录---get
router.get("/v2/login",(req,res)=>{
	var obj=req.query;
	var $uname=obj.uname;
	var $upwd=obj.upwd;
	if(!$uname){
		res.send("用户名为空");
		return;
	}
	if(!$upwd){
		res.send("用户密码为空");
		return;
	}
	//res.send($uname+","+$upwd);
	//查询数据库
	pool.query("SELECT * FROM xz_user WHERE uname=? AND upwd=?",[$uname,$upwd],(err,result)=>{
		if(result.length>0){
			res.send("1");
		}else{
			res.send("0");
		}
	});
});
//5.登录 restful Api
router.get("/v3/login/:uname-:upwd",(req,res)=>{
	var obj=req.params;
	var $uname=obj.uname;
	var $upwd=obj.upwd;
	if(!$uname){
		res.send("用户名为空");
		return;
	}
	if(!$upwd){
		res.send("用户密码为空");
		return;
	}
	//res.send($uname+","+$upwd);
	//查询数据库
	pool.query("SELECT * FROM xz_user WHERE uname=? AND upwd=?",[$uname,$upwd],(err,result)=>{
		if(result.length>0){
			res.send("1");
		}else{
			res.send("0");
		}
	});
});
//6.post的登录
router.post("/v1/login",(req,res)=>{
	console.log(1111111);
	//1.获取用户名称
	var $uname=req.body.uname;
	var $upwd=req.body.upwd;
	console.log($uname+"...."+$upwd);
	var sql="SELECT * FROM xz_user where uname=? AND upwd=?";
	pool.query(sql,[$uname,$upwd],(err,result)=>{
		if(result.length>0){
			res.send("1");
		}else{
			res.send("0");
		}
	});
});
//6.查询用户列表
router.get('/userlist',(req,res)=>{
	//执行SQL语句
	pool.query('SELECT * FROM xz_user',function(err,result){
		if(err) throw err;
		res.send(result);
	});
});
//导出路由器
module.exports=router;