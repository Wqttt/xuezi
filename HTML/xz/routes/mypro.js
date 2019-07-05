const express=require('express');
//引入连接池模块
const pool=require('../pool.js');
//创建路由器对象
var router=express.Router();
//添加路由
//1.登录
router.get("/v1/login/:uname-:upwd",(req,res)=>{
   var $uname=req.params.uname;
   var $upwd=req.params.upwd;
   if(!$uname){
	   res.send("用户名为空");
	   return;
   }
   if(!$upwd){
		res.send("密码为空");
		return;
   }
   var sql="SELECT * FROM xz_user WHERE uname=? AND upwd=?";
   pool.query(sql,[$uname,$upwd],(err,result)=>{
	   if(err) throw err;
	   if(result.length>0){
			res.send("1");
	   }else{
			res.send("0");
	   }
   });
});
//2.查询用户列表
router.get("/v1/userlist",(req,res)=>{
	var sql="SELECT * FROM xz_user";
	pool.query(sql,function(err,result){
		if(err) throw err;
		res.send(result);
	});
});
//3.删除用户
router.delete("/v1/deluser/:uid",(req,res)=>{
	var $uid=req.params.uid;
	var sql="DELETE FROM xz_user WHERE uid=?";
	pool.query(sql,[$uid],(err,result)=>{
		if(err) throw err;
		console.log(result);
		if(result.affectedRows>0){
			res.send("1");
		}else{
			res.send("0");
		}
	});
});
//4.修改用户
router.get("/v1/queryuser/:uid",(req,res)=>{
	var $uid=req.params.uid;
	var sql="SELECT * FROM xz_user WHERE uid=?";
	pool.query(sql,[$uid],(err,result)=>{
		if(err) throw err;
		if(result.length>0){
			res.send(result);
		}else{
			res.send("0");
		}
	});
});
router.put("/v1/updateuser",(req,res)=>{
	var $uid=req.body.uid;
	var $uname=req.body.uname;
	var $email=req.body.email;
	var $phone=req.body.phone;
	var $user_name=req.body.user_name;
	var $gender=req.body.gender;
	if(!$uid){
		res.send("uid未接收到");
		return;
	}
	if(!$uname){
		res.send("uname未接收到");
		return;
	}
	if(!$email){
		res.send("email未接收到");
		return;
	}
	if(!$phone){
		res.send("phone未接收到");
		return;
	}
	if(!$user_name){
		res.send("user_name未接收到");
		return;
	}
	if(!$gender){
		res.send("gender未接收到");
		return;
	}
	var sql="UPDATE xz_user SET uname=?,email=?,phone=?,user_name=?,gender=? WHERE uid=?";
	pool.query(sql,[$uname,$email,$phone,$user_name,$gender,$uid],(err,result)=>{
		if(err) throw err;
		res.send("1");
	});
});
//5.注册
router.post("/v1/reguser",(req,res)=>{
	var $uid=req.body.uid;
	var $uname=req.body.uname;
	var $upwd=req.body.upwd;
	var $email=req.body.email;
	var $phone=req.body.phone;
	var $avatar=req.body.avatar;
	var $user_name=req.body.user_name;
	var $gender=req.body.gender;
	console.log($uid+$uname+$upwd+$email+$phone+$avatar+$user_name+$gender);
	if(!$uid){
		res.send("uid未接收到");
		return;
	}
	if(!$uname){
		res.send("uname未接收到");
		return;
	}
	if(!$upwd){
		res.send("upwd未接收到");
		return;
	}
	if(!$email){
		res.send("email未接收到");
		return;
	}
	if(!$phone){
		res.send("phone未接收到");
		return;
	}
	if(!$avatar){
		res.send("avatar未接收到");
		return;
	}
	if(!$user_name){
		res.send("user_name未接收到");
		return;
	}
	if(!$gender){
		res.send("gender未接收到");
		return;
	}
	var sql="INSERT INTO xz_user VALUES(?,?,?,?,?,?,?,?)";
	pool.query(sql,[$uid,$uname,$upwd,$email,$phone,$avatar,$user_name,$gender],(err,result)=>{
		if(err) throw err;
		console.log(result);
		if(result.affectedRows>0){
			res.send("1");
		}else{
			res.send("0");
		}
	});
});
//导出路由器
module.exports=router;