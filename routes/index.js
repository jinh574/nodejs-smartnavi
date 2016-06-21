var express = require('express');
var router = express.Router();
var busLocation = require('../lib/busLocation');
var subwayLocation = require('../lib/subwayLocation');
var weatherModule = require('../lib/weather');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: '뚜벅초 프로토타입' });
});

//버스
router.get('/bus/:busNumber/:endX/:endY/:timestamp', function(req, res, next) {
	var busNumber = req.params.busNumber;
	var endX = req.params.endX;
	var endY = req.params.endY;
	var date = new Date(req.params.timestamp * 1000);
	var bus = new busLocation(busNumber, endX, endY);
	async.waterfall([
		function(callback) {
			bus.getRouteId(function(routeId) {
				console.log(busNumber + "의 routeId : ", routeId);
				if(routeId == null) {
					callback(1);
				}
				else {
					callback(null, routeId);
				}
			});
		},
		function(routeId, callback) {
			bus.getRouteSeq(routeId, function(data) {
				callback(null, routeId, data);
			});
		},
		function(routeId, stationInfo, callback) {
			bus.getLocation(routeId, stationInfo, date, function(data){
				//console.log(routeId + "의 실시간위치 : \n", data);
				callback(null, data);
			});
		},
		function(obj, callback) {
			bus.getRemainTime(obj, date, function(data) {
				callback(null, data);
			});
		}
	], function(err,data) {
		if(err) {
			console.log(err);
			//res.json(data);
			res.sendStatus(404);
		}
		else {
			if(data) {
				res.json({
					"status": 200,
					"data": new Date(data).getTime()
				});
			}
			else {
				console.log("Null로 인한 아웃");
				res.json({
					"status": 204,
					"data": null,
					"description": "실시간 데이터가 없음"
				});
			}
		}
	});
});

//지하철
router.get('/subway/:line/:frcode/:direction/:timestamp', function(req, res, next) {
	var frcode = req.params.frcode;
	var line = req.params.line;
	var direction = req.params.direction;
	var date = new Date(req.params.timestamp*1000);
	var subway = new subwayLocation(date, line, frcode, direction);

	async.waterfall([
		function(callback) {
			subway.getInfo(function(data) {
				console.log(data);
				callback(null);
			})
		},
		function(callback) {
			if(date.getTime() - Date.now() < 0) {
				callback("비정상접근");
			}
			else if(date.getTime() - Date.now() < 3600*1000) { //1시간 이내일 경우
				subway.getRemainByLocation(function(data) {
					if(data) {
						console.log("실시간");
						callback(null, data);
					}
					else {
						subway.getRemainByTimetable(function(reData) {
							console.log("테이블로 다시");
							callback(null, reData);
						});
					}
				});
			}
			else { //이외의 경우
				subway.getRemainByTimetable(function(data) {
					callback(null, data);
				});
			}
		}
	], function(err, result) {
		if(err) {
			console.log(err);
			res.sendStatus(404);
		}
		else {
			console.log("Async success", result);
			if(result == null) {
				res.json({
					"status": 204,
					"data": null,
					"description": "해당사항없음"
				});
			}
			else {
				res.json({
					"status": 200,
					"data": result.getTime()
				});
			}
		}
	});
});

//날짜
router.get('/weather/:timestamp', function(req, res, next) {
	var date = new Date(req.params.timestamp * 1000);
	var weather = new weatherModule(date);
	weather.getCurrent(function(data) {
		res.json(data);
	});
});

module.exports = router;
