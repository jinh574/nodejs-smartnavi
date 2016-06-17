var jsParser = require('./general');
var fs = require('fs');

var JsSubwayLocation = function(date, line, fr_code, direction) {
	var serviceKey = encodeURIComponent('616e7478786a6b623133324e70426543');
	var stationName;
	
	this.getInfo = function(callback) {
		fs.readFile('data/subway_info.json', 'utf8', function(err, data) {
			if(err) throw err;
			obj = JSON.parse(data);
			obj = obj.DATA.filter(function(x) { 
				if(x.FR_CODE == fr_code) {
					stationName = x.STATION_NM;
					callback(stationName);
				}
			});
	   });
	}
	
	this.getRemainByLocation = function(callback) {						
		var url = 'http://swopenapi.seoul.go.kr/api/subway';
		var queryParams = '/' + serviceKey;
		queryParams += '/json/realtimePosition/0/300';
		queryParams += '/' + encodeURIComponent(line + '호선');
		var parser = new jsParser(url + queryParams);
		
		parser.getJson(function(data) {
			var count = 0;
			var result = [];
			var searchDate = date.getFullYear() + ("0" + (date.getMonth()+1)).slice(-2) + ("0" + date.getDate()).slice(-2) + "";
			var tmp = data.realtimePositionList;
			tmp.forEach(function(item, index, arr) {
				if(item.lastRecptnDt == searchDate) {
					count++;
					result.push(item);
				}
				else {
					count++;
				}
				if(count == arr.length) {
					callback(result);
				}
			});
		});
	}
	
	this.getRemainByTimetable = function(callback) {
		var url = 'http://openapi.seoul.go.kr:8088';
		var queryParams = '/' + serviceKey;
		queryParams += '/json/SearchSTNTimeTableByFRCodeService/1/400';
		queryParams += '/' + fr_code;
		
		if(date.getDay() == 0) { //일요일
			queryParams += '/' + 3;
		}
		else if(date.getDay() == 6) {
			queryParams += '/' + 2;
		}
		else {
			queryParams += '/' + 1;
		}
		queryParams += '/' + direction;
		
		var parser = new jsParser(url + queryParams);
		parser.getJson(function(data) {
			var best;
			var obj = data.SearchSTNTimeTableByFRCodeService.row;
			console.log(date);
			obj.forEach(function(item, index, arr) {
				var arrive = item.ARRIVETIME.split(':');
				if(arrive[0] == date.getHours() && arrive[1] <= date.getMinutes() && arrive[2] <= date.getSeconds()) {
					best = arrive;
				}
				else if(arrive[0] == date.getHours()-1 && arrive[1] < 60 && arrive[2] <= date.getSeconds()) {
					best = arrive;
				}
				if(index == arr.length - 1) {
					if(!best) {
						console.log("None");
						callback(null);
					} 
					else {
						var resultRemain = new Date(date.getFullYear(), date.getMonth(), date.getDate(), best[0], best[1], best[2]);
						callback(resultRemain);
					}
				}
			});
		});
	}
	
	return this;
}

module.exports = JsSubwayLocation;