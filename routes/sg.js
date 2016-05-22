var express = require('express');
var router = express.Router();
var testing = require('../lib/sgfunction.js');
var http = require('http');
var sys=require('util');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var result;
var body;
var options = 
{
		host: 'openapi.seoul.go.kr',
		port: 8088,
		path:'/sample/xml/CardSubwayStatsNew/1/5/20151101'
};

router.get('/', function(req, res, next) {
	
	http.get(options,function (res)
			{
				body="";
				res.on('data',function (chunk)
						{
							sys.debug("response...");
							body+=chunk;
						});
				
				res.on('end',function()
						{
							sys.debug("end...");
							parser.parseString(body, function(err, res) {
								result = res;
							});
							console.log(result);
						});
			})
			.on('error',function (e)
			{
				console.log("Got error" + e.message);
			});
	
});

	



module.exports = router;
