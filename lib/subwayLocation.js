var jsParser = require('./general');
var fs = require('fs');
var mongoose = require('mongoose');

var timeRemainSchema = mongoose.Schema({
	nodeTo: String,
	nodeFrom: String,
	remainTime: Number
});

var timeRemainDB = mongoose.model('timeRemain', timeRemainSchema);

var JsSubwayLocation = function(date, line, fr_code, direction) { //date는 탑승 시간, 호선, 역외부코드, 방향(0:외선(하행), 1:내선(상행))
	var serviceKey = encodeURIComponent('616e7478786a6b623133324e70426543');
	var stationName;
	var dataInfo;
	
	this.getInfo = function(callback) {
		fs.readFile('data/subway_info.json', 'utf8', function(err, data) {
			if(err) throw err;
			dataInfo = JSON.parse(data);
			dataInfo.DATA.filter(function(x) {
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
			var result = [];
			var searchDate = date.getFullYear() + ("0" + (date.getMonth()+1)).slice(-2) + ("0" + date.getDate()).slice(-2) + "";
			var tmp = data.realtimePositionList;
			var remainTimeResult = 9999;
			var remainTimeCount = 0;
			var doneFlag = 0;
			var standardTime = (date.getTime() - Date.now()) / 60000;
		
			//new timeRemainDB({'nodeTo': 228, 'nodeFrom': 225, 'remainTime': 8}).save();
			/*
			timeRemainDB.findOne({'nodeTo': "222"}, function(err,doc) {
				if(err) console.log(err);
				console.log(doc);
			});
			*/
			tmp.forEach(function(item, index, arr) {
				if(item.lastRecptnDt == searchDate && item.updnLine == direction && item.statnNm != stationName) {
					var tmp_filter;
					tmp_filter = dataInfo.DATA.filter(function(x) {
						return x.STATION_NM == item["statnNm"] && x.LINE_NUM.charAt(0) == line;
					});
					if(tmp_filter.length) {
						remainTimeCount++;
						item.fr_code = tmp_filter[0].FR_CODE;
						timeRemainDB.findOne({
							$or: [{'nodeTo': fr_code, 'nodeFrom': item.fr_code}, {
								'nodeTo': item.fr_code,
								'nodeFrom': fr_code
							}]
						}, function (err, doc) {
							if (err) console.log(err);
							if (doc) {
								if(0 < doc.remainTime - standardTime && doc.remainTime - standardTime < remainTimeResult) {
									remainTimeResult = doc.remainTime - standardTime;
								}
								remainTimeCount--;
								if(doneFlag == 1 && remainTimeCount == 0) {
									if(remainTimeResult == 9999) {
										callback(null);
									}
									else {
										callback(new Date(date.getTime() + (Math.round(remainTimeResult) * 60000)));
									}
								}
							}
							else {
								var remainParser = new jsParser("http://swopenAPI.seoul.go.kr/api/subway/"+serviceKey+"/json/shortestRoute/0/1/"+encodeURIComponent(stationName)+"/"+encodeURIComponent(item.statnNm));
								remainParser.getJson(function(remainData) {
									if(remainData) {
										if(!remainData.hasOwnProperty("errorMessage")) {
											console.log(item.statnNm, stationName);
										}
										else {
											timeRemainDB.create({
												'nodeTo': fr_code,
												'nodeFrom': item.fr_code,
												'remainTime': remainData.shortestRouteList[0].shtTravelTm
											},function(err, data) {
												if(err) console.log(err);
											});
										}
										if(0 < remainData.shortestRouteList[0].shtTravelTm - standardTime && remainData.shortestRouteList[0].shtTravelTm - standardTime < remainTimeResult) {
											remainTimeResult = remainData.shortestRouteList[0].shtTravelTm - standardTime;
										}
									}
									else {
										console.log(remainData);
									}

									remainTimeCount--;
									if(doneFlag == 1 && remainTimeCount == 0) {
										if(remainTimeResult == 9999) {
											callback(null);
										}
										else {
											callback(new Date(date.getTime() + (Math.round(remainTimeResult) * 60000)));
										}
									}
								});
							}
						});
					}
				}
				if(index == arr.length - 1) {
					doneFlag = 1;
				}
				/*
				if(item.lastRecptnDt == searchDate && item.updnLine == direction && item.subwayNm.charAt(0) == line) {
					var tmp_filter;
					delete item["beginRow"];
					delete item["endRow"];
					delete item["pageRow"];
					delete item["totalCount"];
					delete item["rowNum"];
					delete item["selectedCount"];
					delete item["curPage"];
					delete item["lastRecptnDt"];
					tmp_filter = dataInfo.DATA.filter(function(x) {
						return x.STATION_NM == item["statnNm"] && x.LINE_NUM.charAt(0) == line;
					});
					if(tmp_filter.length) {
						var timeRemain;

						item["fr_code"] = tmp_filter[0].FR_CODE;
						if(line == 2 && item.statnNm != "신설동") { //2호선 예외처리
							if(item.fr_code.split("-").length == 1) {
								if (item.fr_code.split("-")[0] < fr_code.split("-")[0]) { //기준으로부터 직렬화
									timeRemain = 43 + (item.fr_code.split("-")[0] - fr_code.split("-")[0]);
								}
								else {
									timeRemain = item.fr_code.split("-")[0] - fr_code.split("-")[0];
								}
							}
							else { //분기되는 곳에서 계산
								if(item.fr_code.split("-")[0] == fr_code.split("-")[0]) {
									//아직 미완
								}
							}
						}

						if(direction == 0) {
							timeRemain = timeRemain * 2;
						}
						else {
							timeRemain = (43 - timeRemain) * 2;
						}
						console.log(item.statnNm, timeRemain)
						item.statnNm != "신설동" && item.fr_code != fr_code ? result.push(item) : 0;
					}
				}
				if(index == arr.length - 1) {
					var bestRemain = 0;
					var tmp_targetSplit;
					var tmp_sourceSplit = fr_code.split("-");
					var calcTime;

					result.forEach(function (location, locIndex, locArr) {
						targetSplit = location.fr_code.split("-");
						if(targetSplit.length == 1) { // 외부코드가 단일일때
							calcTime = Math.abs(targetSplit[0] - tmp_sourceSplit[0]) * 2;
						}
						else { //외부코드가 분기될때
							calcTime = Math.abs(targetSplit[0] - tmp_sourceSplit[0]) * 2;
							if(tmp_sourceSplit.length == 2) {
								calcTime += Math.abs(targetSplit[1] - tmp_sourceSplit[1]) * 2;
							}
							else {
								calcTime += targetSplit[1] - 1;
							}
						}
						if (!bestRemain) {
							bestRemain = calcTime;
						}
						else if (bestRemain > calcTime) {
							bestRemain = calcTime;
						}
						//console.log(locIndex, location.statnNm, calcTime, bestRemain)
						if (locIndex == locArr.length - 1) {
							callback(bestRemain);
						}
					});
				}
				*/
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
			var doneFlag = 0;
			if(data.hasOwnProperty("SearchSTNTimeTableByFRCodeService")) {
				var obj = data.SearchSTNTimeTableByFRCodeService.row;
				obj.forEach(function(item, index, arr) {
					var arrive = item.ARRIVETIME.split(':');
					/*
					if(arrive[0] == date.getHours() && arrive[1] >= date.getMinutes() && arrive[2] >= date.getSeconds()) {
						best = arrive;
					}
					else if(arrive[0] == date.getHours() && arrive[1] < 60 && arrive[2] <= date.getSeconds()) {
						best = arrive;
						console.log(arrive);
					}*/
					if(arrive[0] == date.getHours() && (arrive[1] >= date.getMinutes() || (arrive[1] == date.getMinutes() && arrive[2] >= date.getSeconds())) && !doneFlag) {
						best = arrive;
						doneFlag = 1;
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
			}
			else {
				callback(null);
			}
		});
	}
	
	return this;
}

module.exports = JsSubwayLocation;