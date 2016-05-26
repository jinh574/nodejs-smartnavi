var express = require('express');
var router = express.Router();
var jsParser = require('../lib/kb')
var test = require('../lib/filter')

/* GET home page. */
router.get('/', function(req, res, next)
{
	 //var parser = new jsParser("http://dev.odsay.com/Denny_test/appleTree/v1/0/Path/PathSearch_Exit.asp?Output=json&Echo=yes&Output=json&SX=127.0414533&SY=37.5551612&EX=126.9401193&EY=37.5597722&OPT=0&svcID=56f14f5c5ed77cdf26fec5f852c54abe");
	 //res.send(parser.getJson().result);
	 //res.send(test.rideFilter(127.0414533, 37.5551612, 126.9401193, 37.5597722, 2016, 04, 8));
	 res.send(test.rideFilter(127.07934279999995, 37.5407625, 126.97794509999994, 37.5662952, 2016, 4, 4));
});

router.get('/sg', function(req, res, next)
{
	var srcx = 127.0414533
	var srcy = 37.5551612;
	var acix = 126.9401193;
	var aciy = 37.5597722;
	 
	var radsrcy = Math.PI * srcy / 180;
	var radaciy = Math.PI * aciy / 180;
	var theta = srcx - acix;
	var radtheta = Math.PI * theta / 180;
	
	var dist = Math.sin(radsrcy) * Math.sin(radaciy) + Math.cos(radsrcy) * Math.cos(radaciy) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180 / Math.PI;
	dist = dist * 60 * 1.1515;
	dist = dist * 1.609344;
	
	 
	res.send(dist.toString());
});

module.exports = router;