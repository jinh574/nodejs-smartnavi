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


router.get('/path',function(req,res)
{
/*var srcLat = req.query.srcLat;
	var srcLng = req.query.srcLng;
	var dstLat = req.query.dstLat;
	var dstLng = req.query.dstLng;*/
				
	var srcLat = 126.9317438;
	var srcLng = 37.6000000;
	var dstLat = 126.9779453;
	var dstLng = 37.5597722;

	//console.log(req.query);
	var result = sg_func.searchRoute(srcLat,srcLng,dstLat,dstLng);
	res.send(result);
});

router.get('/normalPath',function(req,res)
{
	var start_x = req.query.start_x;
	var start_y = req.query.start_y;	
	var des_x=req.query.des_x;
	var des_y=req.query.des_y;
	//sg_func.normalPath(start_x,start_y,des_x,des_y);
	res.send(sg_func.normalPath(start_x,start_y,des_x,des_y));
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
	res.send(sg_func.filterPath(start_x,start_y,des_x,des_y,year,month,hour));
});



module.exports = router;