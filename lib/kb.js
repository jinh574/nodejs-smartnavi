var xml2js = require('xml2js');
var request = require('sync-request');

var Parser = function (url)
{
	var parser = new xml2js.Parser();
	var json;
	var people;
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

		return json
	};
	
	this.getPeople = function(hour)
	{
		if(!json.hasOwnProperty('CardSubwayTime'))
		{
			return "success";
		}
		
		if(json.CardSubwayTime.row[0][hour] / 300 >= 1)
			{

		return json.CardSubwayTime.row[0][hour];
			}
		else
			{
			return "failed";
			}

	}

	return this;
};

module.exports = Parser;