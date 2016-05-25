var express = require('express');
var router = express.Router();
var testing = require('../lib/general');
var sg_func = require('../lib/sgfunction');

router.get('/', function(req, res) 
{
	var parser = new testing ("http://dev.odsay.com/Denny_test/appleTree/v1/0/Path/PathSearch_Exit.asp?Echo=yes&Output=json&SX=127.0414533&SY=37.5551612&EX=126.9401193&EY=37.5597722&OPT=0&svcID=56f14f5c5ed77cdf26fec5f852c54abe");
	var obj=parser.getJson();
	sg_func.searchRoute(obj);
	res.send(obj);
});

router.get('/map', function(req, res) 
{
	//var parser = new testing ("http://openapi.map.naver.com/openapi/naverMap.naver?ver=2.0&key=qsXajb2Y58r6evyasO9j");
	//var obj=parser.getJson();
	//sg_func.getMap(obj);
	//res.send(obj);
	 res.render('sg', { title: '웹기술및응용', name : '몽둥길' });
});

module.exports = router;