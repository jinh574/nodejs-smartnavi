var xml2js = require('xml2js');
var request = require('request');

var JsParser = function(tmp_url) {
	var parser = new xml2js.Parser();
	var url = tmp_url;
	var ptr_i = 0;
	var ptr_j = 0;
	var parseData;
	
	this.setI = function(tmpi, tmpj) {
		ptr_i = tmpi;
		ptr_j = tmpj;
	};
	
	this.getJson = function(callback) {
		if(!parseData) {
			request(url, function(err, res, body) {
				var tmp = body.toString();
				var type = res.headers['content-type'];
				if(type.indexOf("json")+1) {
					parseData = JSON.parse(tmp);
					callback(JSON.parse(tmp), ptr_i, ptr_j);
				}
				else if(type.indexOf("xml")+1) {
					parser.parseString(tmp, function(err, result) {
						parseData = tmp;
						callback(result, ptr_i, ptr_j);
					});
				}
				else {
					console.log("It is not JSON/XML");
					return;
				}
			});
		}
		else {
			callback(parseData, ptr_i, ptr_j);
		}
	};
	
	this.getUrl = function(callback) {
		console.log(url);
		return url;
	}
	
	this.getSubwayPeople = function(hour, json, callback)
	{
		if(!json.hasOwnProperty('CardSubwayTime'))
		{
			//return "passed";
			callback(ptr_i, "passed");
		}
		else if(json.CardSubwayTime.row[0][hour] / 1800 <= 10)
		{
			//return "passed";
			callback(ptr_i, "passed");
		}
		else
		{
			//return "failed";
			callback(ptr_i, "failed");
		}
	}
	
	this.getBusPeople = function(startBus, hour, json, callback)
	{
		if(!json.hasOwnProperty('CardBusTimeNew'))
		{
			//return "passed";
			callback(ptr_i, "passed");
		}
		else {
			for(var i = 0; i < json.CardBusTimeNew.row.length; i++)
			{
				if(json.CardBusTimeNew.row[i]['BUS_STA_NM'].toString() == startBus.toString())
				{
					if(json.CardBusTimeNew.row[i][hour] / 180 <= 10)
					{
						//return "passed";
						callback(ptr_i, "passed");
					}
					else
					{
						//return "failed";
						callback(ptr_i, "failed");
					}
				}
			}
		}
	}
	
	return this;
};

module.exports = JsParser;