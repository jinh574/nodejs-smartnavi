var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var http = require('http');

exports.func = function getXML(url)
{
	var data = "";
	var result;
	http.get(url, function(res) {
		res.on('data', function(data_) {
			data += data_.toString();
		});
		res.on('end', function() {
			parser.parseString(data, function(err, res) {
				result = res;
			});
		})
	});
	return result;
};