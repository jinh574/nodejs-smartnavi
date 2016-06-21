var express = require('express');
var router = express.Router();
var testing = require('../lib/general');
var sg_func = require('../lib/sgfunction');

router.get('/search', function(req, res) 
{
	//큰게 lng
	var srcLat = req.params.srcLat;
	var srcLng = req.params.srcLng;
	var dstLat = req.params.dstLat;
	var dstLng = req.params.dstLng;
	console.log(srcl)
	var parser = new testing ("http://dev.odsay.com/Denny_test/appleTree/v1/0/Path/PathSearch_Exit.asp?Echo=yes&Output=json&SX="+srcLng+"&SY="+srcLat+"&EX="+dstLng+"&EY="+dstLat+"&OPT=0&svcID=56f14f5c5ed77cdf26fec5f852c54abe");
	var obj=parser.getJson();
	res.send(sg_func.searchddRoute(obj));
});


router.get('/optiPath',function(req,res)
{
	var srcLat = req.query.srcLat;
	var srcLng = req.query.srcLng;
	var dstLat = req.query.dstLat;
	var dstLng = req.query.dstLng;
	var startDate = new Date(req.query.startDate*1000);
	var arriveDate = new Date(req.query.arriveDate*1000);
	
	/*var srcLat = 126.9317438;
	var srcLng = 37.6000000;
	var dstLat = 126.9779453;
	var dstLng = 37.5597722;*/
	
	var startDate = new Date(2016,6,22,11,15,10);
	var arrivDate = new Date(2016,6,22,14,15,10);
	//console.log(req.query);
	var result = sg_func.optiSearchRoute(srcLat,srcLng,dstLat,dstLng,startDate,arrivDate,function(data){
		console.log("path 종료")
		res.send(data);
	});
});


router.get('/shortTimePath',function(req,res)
{
	var year = req.query.year;
	var month = req.query.month;
	var day = req.query.day;
	var hour = req.query.hour;
	var min = req.query.min;
	
	var srcLat = 126.9317438;
	var srcLng = 37.6000000;
	var dstLat = 126.9779453;
	var dstLng = 37.5597722;
	//console.log(req.query);
	var result = sg_func.shortTimePath(srcLat,srcLng,dstLat,dstLng,function(data){
		console.log("path 종료")
		res.send(data);
	});
});


router.get('/normalPath',function(req,res)
{
	var start_x = req.query.start_x;
	var start_y = req.query.start_y;	
	var des_x=req.query.des_x;
	var des_y=req.query.des_y;
	//sg_func.normalPath(start_x,start_y,des_x,des_y);
	sg_func.normalPath(start_x, start_y, des_x, des_y, function(data) {
		res.send(data);
	});
	//res.send(sg_func.normalPath(start_x,start_y,des_x,des_y));
});

router.get('/getRealTime',function(req,res){
	var hour = req.query.hour;
	var min = req.query.min;	
	var path = req.path;
	var des_y=req.query.des_y;
});

router.get('/checkAccident',function(req,res)
{
	var path = req.query.path;
	sg_func.searchAccidentPath(path,function(data){
		res.send(data);
	});
});


router.get('/filterPath',function(req,res)
{
	var start_x = req.query.start_x;
	var start_y = req.query.start_y;	
	var des_x=req.query.des_x;
	var des_y=req.query.des_y;
	var year=req.query.year;
	var month=req.query.month;
	var hour=req.query.hour;
	//sg_func.filterPath(start_x,start_y,des_x,des_y,year,month,hour);
	sg_func.filterPath(start_x, start_y, des_x, des_y, year, month, hour, function(data) {
		res.send(data);
	});
	//res.send(sg_func.filterPath(start_x,start_y,des_x,des_y,year,month,hour));
});


router.get('/searchBorardingTime',function(req,res)
{
	var path = req.query.path;
	
})


module.exports = router;