var jsParser = require('./general');

var JsBusLocation = function(busNumber, endX, endY) {
	var routeId;
	var stationInfo;
	this.getRouteId = function(callback) {
		var url = "http://ws.bus.go.kr/api/rest/busRouteInfo/getBusRouteList?serviceKey=7HaSuF8RdKqTmt3may4V8MaXnviGh9Y6atxqSyAlFLM2UIJaTIaFoTah6gZw4lk22sp%2BcoBMP5SMD1ttpsiiag%3D%3D";
		var queryParams = "&strSrch=" + busNumber;
		var parser = new jsParser(url + queryParams);
		parser.getJson(function(data) {
			if(data.hasOwnProperty("msgBody")) {
				routeId = data.ServiceResult.msgBody[0].itemList[0].busRouteId[0];
				callback(data.ServiceResult.msgBody[0].itemList[0].busRouteId[0]);
			}
			else {
				callback(null);
			}
		});
	}
	
	this.getRouteSeq = function(routeId, callback) {
		var url = "http://ws.bus.go.kr/api/rest/busRouteInfo/getStaionByRoute?serviceKey=7HaSuF8RdKqTmt3may4V8MaXnviGh9Y6atxqSyAlFLM2UIJaTIaFoTah6gZw4lk22sp%2BcoBMP5SMD1ttpsiiag%3D%3D";
		var queryParams = "&busRouteId=" + routeId;
		var parser = new jsParser(url + queryParams);
		parser.getJson(function(data) {
			getNearBy(data, endX, endY, function(item) {
				stationInfo = item;
				endX = item.gpsX;
				endY = item.gpsY;
				callback(item);
			});
		});
	}
	
	this.getLocation = function(routeId, seq, date, callback) {
		var url = "http://ws.bus.go.kr/api/rest/buspos/getBusPosByRtid?serviceKey=7HaSuF8RdKqTmt3may4V8MaXnviGh9Y6atxqSyAlFLM2UIJaTIaFoTah6gZw4lk22sp%2BcoBMP5SMD1ttpsiiag%3D%3D";
		var queryParams = "&busRouteId=" + routeId;
		var parser = new jsParser(url + queryParams);
		parser.getJson(function(data) {
			cleanStructLocation(data, function(locData) {
				var tmpDate = (date.getTime() - Date.now()) / 60000;
				locData = locData.filter(function(x) {
					return x.sectOrd < seq.seq - parseInt(tmpDate / 5);
				});
				callback(locData);
			});
		});
	}
	
	this.getRemainTime = function(obj, date, callback) {
		var url = "http://ws.bus.go.kr/api/rest/pathinfo/getPathInfoByBus?serviceKey=7HaSuF8RdKqTmt3may4V8MaXnviGh9Y6atxqSyAlFLM2UIJaTIaFoTah6gZw4lk22sp%2BcoBMP5SMD1ttpsiiag%3D%3D";
		var doneCount = 0;
		var result = [];
		obj.forEach(function(item, index, arr) {
			var queryParams  = "&endX=" + endX;
			queryParams += "&endY=" + endY;
			queryParams += "&startX=" + item.gpsX;
			queryParams += "&startY=" + item.gpsY;
			var parser = new jsParser(url + queryParams);
			doneCount++;
			parser.getJson(function(data) {
				console.log(data);
				cleanStructRemain(data, function(parseData) {
					var tmpDate = (date.getTime() - Date.now()) / 60000;
					parseData = parseData.filter(function(x) {
						return x.routeNm == busNumber;
					});
					if(parseData.length) {
						result.push(parseInt(parseData[0].time));
					}
					doneCount--;
					if(doneCount == 0) {
						result = result.sort().filter(function(x) {
							return x > tmpDate;
						});
						console.log(result, tmpDate);
						if(result.length) {
							callback(date.setMinutes(date.getMinutes() + result[0]));
						}
						else {
							callback(null);
						}
					}
				});
			});
		});
	}
	
	return this;
}

function cleanStructRemain(data, callback) {
	var result = [];
	var tmpBody = data.ServiceResult.msgBody[0].itemList;
	if(tmpBody) {
		tmpBody.forEach(function(item, index, arr) {
			var tmp = {
				"distance": item.distance[0],
				"routeId": item.pathList[0].routeId[0],
				"routeNm": item.pathList[0].routeNm[0],
				"time": item.time[0]	
			};
			result.push(tmp);
			
			if(index == arr.length -1) {
				callback(result);
			}
		});
	}
	else {
		callback(result);
	}
}

function cleanStructLocation(data, callback) {
	var result = [];
	var tmpBody = data.ServiceResult.msgBody[0].itemList;
	tmpBody.forEach(function(item, index, arr) {
		var tmp = {
			"busType": item.busType[0],
			"dataTm": item.dataTm[0],
			"gpsX": item.gpsX[0],
			"gpsY": item.gpsY[0],
			"isFullFlag": item.isFullFlag[0],
			"islastyn": item.islastyn[0],
			"isrunyn": item.isrunyn[0],
			"lastStTm": item.lastStTm[0],
			"lastStnId": item.lastStnId[0],
			"nextStTm": item.nextStTm[0],
			"plainNo": item.plainNo[0],
			"posX": item.posX[0],
			"posY": item.posY[0],
			"rtDist": item.rtDist[0],
			"sectDist": item.sectDist[0],
			"sectOrd": item.sectOrd[0],
			"sectionId": item.sectionId[0],
			"stopFlag": item.stopFlag[0],
			"vehId": item.vehId[0],
			"fullSectDist": item.fullSectDist[0],
			"trnstnid": item.trnstnid[0]
		};
		result.push(tmp);
		
		if(index == arr.length - 1) {
			callback(result);
		} 
	});
}

function getNearBy(data, x, y, callback) {
	var result;
	var standard = 999999999;
	data = data.ServiceResult.msgBody[0].itemList;
	data.forEach(function(item, index, arr) {
		var disX = item.gpsX - x;
		var disY = item.gpsY - y;
		var distance = Math.sqrt(Math.abs(disX*disX) + Math.abs(disY*disY));
		if(standard > distance) {
			standard = distance;
			result = item;
		}
		
		if(index == arr.length - 1) {
			callback(result);
		}
	});
};

module.exports = JsBusLocation;