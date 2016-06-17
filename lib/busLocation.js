var jsParser = require('./general');

var JsBusLocation = function(busNumber) {
	var serviceKey = encodeURIComponent('7HaSuF8RdKqTmt3may4V8MaXnviGh9Y6atxqSyAlFLM2UIJaTIaFoTah6gZw4lk22sp%2BcoBMP5SMD1ttpsiiag%3D%3D');
	var cityCode = 11;
	var queryParams = '?ServiceKey=' + serviceKey;
	
	this.getBusId = function() {
		queryParams += '&cityCode=' + cityCode;
		queryParams += '&routeNo=' + busNumber;
		var url = 'http://openapi.tago.go.kr/openapi/service/BusRouteInfoInqireService/getRouteNoList' + queryParams;
		var parser = new jsParser(url);
		parser.getJson(function(data) {
			console.log(data);
		});
	}
	
	this.getLocation = function() {
		console.log(url);
		var parser = new jsParser(url);
		parser.getJson(function(data) {		
			
		});
	}
	
	return this;
}

module.exports = JsBusLocation;