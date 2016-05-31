var xml2js = require('xml2js');
var request = require('sync-request');
//var request = require('sync-request');
//var sync = require('synchronize');
//sync(request);

var JsParser = function(url) {
	var parser = new xml2js.Parser();
	var json;
	
	try {
		var res = request('GET', url);
		var tmp = res.getBody().toString();
		var type = res.headers['content-type'];
		if(type.indexOf("json")+1) {
			json = JSON.parse(tmp);
		}
		else if(type.indexOf("xml")+1) {
			parser.parseString(tmp, function(err, result) {
				json = result;
			});
		}
		else {
			console.log("erorr");
		}

	} catch (err) {
		console.log(err)
	}

	this.getJson = function() {
		/*
		request(url, function(err, res, body) {
			var tmp = body.toString();
			var type = res.headers['content-type'];
			if(type.indexOf("json")+1) {
				json = JSON.parse(tmp);
				callback(json);
			}
			else if(type.indexOf("xml")+1) {
				console.log('xml');
				parser.parseString(tmp, function(err, result) {
					json = result;
					callback(json);
				});
			}
			else {
				console.log("It is not JSON/XML");
				return;
			}
		});
		*/
		return json;
	};
	
	this.getSubwayPeople = function(hour)
	{
		if(!json.hasOwnProperty('CardSubwayTime'))
		{
			return "passed";
		}
		
		if(json.CardSubwayTime.row[0][hour] / 1800 <= 10)
		{
			return "passed";
		}
		else
		{
			return "failed";
		}
	}
	
	this.getBusPeople = function(startBus, hour)
	{
		if(!json.hasOwnProperty('CardBusTimeNew'))
		{
			return "passed";
		}
		
		for(var i = 0; i < json.CardBusTimeNew.row.length; i++)
		{
			if(json.CardBusTimeNew.row[i]['BUS_STA_NM'].toString() == startBus.toString())
			{
				if(json.CardBusTimeNew.row[i][hour] / 180 <= 10)
				{
					return "passed";
				}
				else
				{
					return "failed";
				}
			}
		}
	}
	
	return this;
};

module.exports = JsParser;