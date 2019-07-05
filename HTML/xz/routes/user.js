const express=require('express');
//引入连接池模块
const pool=require('../pool.js');//上一级../，上两级../../
//创建路由器对象
var router=express.Router();
//添加路由
//1.用户注册
router.post('/reg',function(req,res){
	//1.1获取post请求数据
	var obj=req.body;
	console.log(obj);
	//1.2验证每一项的数据是否为空
	//例如：用户名为空 提示“用户名不能为空”
	if(!obj.uname){
		res.send({code:401,msg:'uname required'});
		//return 阻止往后执行
		return;
	}
	if(!obj.upwd){
		res.send({code:402,msg:'upwd required'});
		return;
	}
	if(!obj.email){
		res.send({code:403,msg:'email required'});
		return;
	}
	if(!obj.phone){
		res.send({code:404,msg:'phone required'});
		return;
	}
	//1.3执行SQL语句
	//先使用连接池对象
	pool.query('INSERT INTO xz_user SET ?',[obj],function(err,result){
		if(err) throw err;
		console.log(result);
		//判断是否插入成功
		if(result.affectedRows>0){
			res.send({code:200,msg:'reg success'});
		}
	});
});
//2.用户登录
router.post('/login',function(req,res){
	//2.1获取post请求数据
	var obj=req.body;
	//console.log(obj);
	//2.2验证数据是否为空
	if(!obj.uname){
		res.send({code:401,msg:'uname required'});
		return;
	}
	if(!obj.upwd){
		res.send({code:402,msg:'upwd required'});
		return;
	}
	//2.3执行SQL语句
	pool.query('SELECT * FROM xz_user WHERE uname=? AND upwd=?',[obj.uname,obj.upwd],function(err,result){
		if(err) throw err;
		console.log(result);
		//判断数组长度是否大于0
		if(result.length>0){
			res.send({code:200,msg:'login success'});
		}else{
			res.send({code:301,msg:'login error'});
		}
	});
});
//3.检索用户（详情）
router.get('/detail',function(req,res){
	//3.1获取get请求数据
	var obj=req.query;
	console.log(obj);
	//3.2验证数据是否为空
	if(!obj.uid){
		res.send({code:401,msg:'uid required'});
		return;
	}
	//3.3执行SQL语句
	pool.query('SELECT * FROM xz_user WHERE uid=?',[obj.uid],function(err,result){
		if(err) throw err;
		//把查询到的数据直接响应到浏览器端
		res.send(result);
		/*//判断数组长度是否大于0，大于则存在该用户
		if(result.length>0){
			res.send({code:200,msg:'detail success'});
		}else{
			res.send({code:301,msg:'detail error'});
		}*/
	});
});
//4.修改用户
router.get('/update',function(req,res){
	//4.1获取get数据
	var obj=req.query;
	console.log(obj);
	//4.2验证数据是否为空
	//批量验证，获取每一个属性，然后判断是否为空
	var i=400;
	for(var key in obj){
		i++;
		//属性值是否为空
		if(!obj[key]){
			res.send({code:i,msg:key+' required'});
			return;
		}
	}
	//4.3执行SQL语句
	pool.query('UPDATE xz_user SET email=?,phone=?,user_name=?,gender=? WHERE uid=?',[obj.email,obj.phone,obj.user_name,obj.gender,obj.uid],function(err,result){
		if(err) throw err;
		console.log(result);
		//判断是否修改成功
		if(result.affectedRows>0){
			res.send({code:200,msg:'update success'});
		}else{
			res.send({code:301,msg:'update error'});
		}
	});
});
//5.用户列表
router.get('/list',function(req,res){
	//5.1获取get请求的数据
	var obj=req.query;
	//console.log(obj);
	//5.2将数据转为整型
	obj.pno=parseInt(obj.pno);
	obj.size=parseInt(obj.size);
	//5.3验证数据是否为空
	if(!obj.pno){
		obj.pno=1;
	}
	if(!obj.size){
		obj.size=2;
	}
	console.log(obj);
	//res.send(obj);
	//5.4计算每页的开始
	var start=(obj.pno-1)*obj.size;
	//5.5执行SQL语句，把结果响应给浏览器端
	pool.query('SELECT * FROM xz_user LIMIT ?,?',[start,obj.size],function(err,result){
		if(err) throw err;
		res.send(result);
	});
});
//6.删除用户
router.get('/delete',function(req,res){
	//6.1获取get请求数据
	var obj=req.query;
	console.log(obj);
	//6.2验证数据是否为空
	if(!obj.uid){
		res.send({code:401,msg:'uid required'});
		return;
	}
	//6.3执行SQL语句
	pool.query('DELETE FROM xz_user WHERE uid=?',[obj.uid],function(err,result){
		if(err) throw err;
		console.log(result);
		//判断是否删除成功 affectedRows受影响的行数
		if(result.affectedRows>0){
			res.send({code:200,msg:'delete success'});
		}else{
			res.send({code:301,msg:'delete error'});
		}
	});
});
//导出路由器
module.exports=router;