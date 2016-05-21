var express = require('express');
var router = express.Router();
var testing = require('../lib/sgfunction.js');
var http = require('http');
var sys=require('util');
var xml2js = require('xml2js');

var options = 
{
		host: 'openapi.seoul.go.kr',
		port: 8088,
		path:'/sample/xml/CardSubwayStatsNew/1/5/20151101'
};

http.get(options,function (response)
{
	var body="";
	response.addListener('data',function (chunk)
			{
				sys.debug("response...");
				body+=chunk;
			});
	
	response.addListener('end',function()
			{
				sys.debug("end...");
				jsonObj = xml2json.parser(body);
				for(itemName in jsonObj.rss.channel)
				{
					console.log(jsonObj.rss.channel[itemName]);
				}
			});
})
.on('error',function (e)
{
	console.log("Got error" + e.message);
});
	



module.exports = router;