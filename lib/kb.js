var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var http = require('http');

exports.func = function kb(name)
{
	var data = "";
	http.get('http://uclab.konkuk.ac.kr/static/files/201601webcomputing/book.xml', function(res) {
		res.on('data', function(data_) {
			data += data_.toString();
		});
		res.on('end', function() {
			parser.parseString(data, function(err, result) {
				console.log(result.bookstore.book);
			});
		})
	});
	
	console.log(name);
};