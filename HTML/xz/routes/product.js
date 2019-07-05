const express=require('express');
//引入连接池模块
const pool=require('../pool.js');//上一级../，上两级../../
//创建路由器对象
var router=express.Router();
//添加路由
//1.商品列表
router.get('/list',function(req,res){
	//1.1获取get请求数据
	var obj=req.query;
	console.log(obj);
	//1.2转为整型
	obj.pno=parseInt(obj.pno);
	obj.size=parseInt(obj.size);
	//1.3验证数据是否为空
	if(!obj.pno){
		obj.pno=1;
	}
	if(!obj.size){
		obj.size=2;
	}
	console.log(obj);
	//1.4计算每页的开始
	var start=(obj.pno-1)*obj.size;
	//1.5执行SQL语句，把结果响应给浏览器端
	pool.query('SELECT * FROM xz_laptop LIMIT ?,?',[start,obj.size],function(err,result){
		if(err) throw err;
		res.send(result);
	});
});
//2.商品详情
router.get('/detail',function(req,res){
	var obj=req.query;
	console.log(obj);
	if(!obj.lid){
		res.send({code:401,msg:'lid required'});
		return;
	}
	//执行SQL语句
	pool.query('SELECT * FROM xz_laptop WHERE lid=?',[obj.lid],function(err,result){
		if(err) throw err;
		res.send(result);
	});
});
//3.修改商品
router.get('/update',function(req,res){
	var obj=req.query;
	console.log(obj);
	//判断是否为空
	var i=400;
	for(var key in obj){
		i++;
		//属性值是否为空
		if(!obj[key]){
			res.send({code:i,msg:key+' required'});
			return;
		}
	}
	//执行SQL语句
	pool.query('UPDATE xz_laptop SET title=?,price=?,details=? WHERE lid=?',[obj.title,obj.price,obj.details,obj.lid],function(err,result){
		if(err) throw err;
		console.log(result);
		//是否修改成功
		if(result.affectedRows>0){
			res.send({code:200,msg:'update success'});
		}else{
			res.send({code:301,msg:'update error'});
		}
	});
});
//4.商品删除
router.get('/delete',function(req,res){
	//6.1获取get请求数据
	var obj=req.query;
	console.log(obj);
	//6.2验证数据是否为空
	if(!obj.lid){
		res.send({code:401,msg:'lid required'});
		return;
	}
	//6.3执行SQL语句
	pool.query('DELETE FROM xz_laptop WHERE lid=?',[obj.lid],function(err,result){
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
//5.商品添加
router.post('/add',function(req,res){
	//1.1获取post请求数据
	var obj=req.body;
	console.log(obj);
	//1.2验证每一项的数据是否为空
	//例如：用户名为空 提示“用户名不能为空”
	if(!obj.title){
		res.send({code:401,msg:'title required'});
		//return 阻止往后执行
		return;
	}
	if(!obj.price){
		res.send({code:402,msg:'price required'});
		return;
	}
	if(!obj.details){
		res.send({code:403,msg:'details required'});
		return;
	}
	//1.3执行SQL语句
	//先使用连接池对象
	pool.query('INSERT INTO xz_laptop SET ?',[obj],function(err,result){
		if(err) throw err;
		console.log(result);
		//判断是否插入成功
		if(result.affectedRows>0){
			res.send({code:200,msg:'reg success'});
		}
	});
});
//导出路由器
module.exports=router;