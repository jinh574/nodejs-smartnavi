var express = require('express');
var router = express.Router();
var busLocation = require('../lib/busLocation');
var subwayLocation = require('../lib/subwayLocation');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: '뚜벅초 프로토타입' });
});

router.get('/test/:line/:frcode/:direction/:timestamp', function(req, res, next) {
	var frcode = req.params.frcode;
	var line = req.params.line;
	var direction = req.params.direction;
	var date = new Date(req.params.timestamp*1000);
	var subway = new subwayLocation(date, line, frcode, direction);

	async.waterfall([
		function(callback) {
			subway.getInfo(function(data) {
				callback(null);
			})
		},
		function(callback) {
			if(date.getTime() - Date.now() < 3600*1000) { //1시간 이내일 경우
				subway.getRemainByLocation(function(data) {
					console.log(data.length);
					callback(null);
				});
			}
			else { //이외의 경우
				subway.getRemainByTimetable(function(data) {
					console.log(data);
					callback(null);
				});
			}
		}
	], function(err) {
		if(err) {
			console.log(err);
		}
		else {
			console.log("Async success");
		}
	});
	res.sendStatus(200);
});

module.exports = router;
