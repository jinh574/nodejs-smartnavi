var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var userDB = require('../lib/db_users');
var planDB = require('../lib/db_plans');
var gpsDB = require('../lib/db_gps');
var srcDB = require('../lib/db_source');

//유저 전체 리스트
router.get('/', function(req, res, next) {
	userDB.find({}, function(err, docs) {
		res.json({
			"status": 200,
			"data": docs
		});
	});
});

//유저 아이디로 검색
router.get('/:_id', function(req, res, next) {
	var _id = req.params._id;
	userDB.findById(_id, function(err, doc) {
		if(err) {
			console.log(err);
			res.sendStatus({
				"status": 204,
			});
		}
		else {
			if(data != null)
				res.json({
					"status": 200,
					"data": doc
				});
			else {
				res.sendStatus({
					"status": 204,
				});
			}
		}
	});
});

//유저 추가
router.post('/', function(req, res, next) {
	var name = req.body.name;
	var id_kakao = req.body.id_kakao;
	var profileUrl = req.body.profileUrl;
	
	userDB.findOne({
		"id_kakao": id_kakao
	}, function(err, doc) {
		if(doc) {
			console.info("이미 생성한 유저\n", doc);
			res.json({
				"status": 200,
				"data": doc._id
			});
		}
		else {
			if(profileUrl) {
				userDB.create({
					"name": name,
					"id_kakao": id_kakao,
					"profileUrl": profileUrl
				}, function(err, createDoc) {
					if(err) {
						console.log(err);
						res.sendStatus({
							"status": 204,
						});
					}
					else {
						console.info("유저가 생성 완료\n", createDoc);
						res.json({
							"status": 200,
							"data": createDoc._id
						});
					}
				});
			}
			else {
				userDB.create({
					"name": name,
					"id_kakao": id_kakao
				}, function(err, createDoc) {
					if(err) {
						console.log(err);
						res.sendStatus({
							"status": 204,
						});
					}
					else {
						console.info("유저가 생성 완료\n", createDoc);
						res.json({
							"status": 200,
							"data": createDoc._id
						});
					}
				});
			}
		}
	});
});

//유저 플랜 리스트
router.get('/:_id/plans', function(req, res, next) {
	var _id = req.params._id;
	planDB.find({
		$or: [
			{ "creator": _id },
			{ "friends": _id }
		]
	}, function(err, docs) {
		res.json({
			"status": 200,
			"data": docs
		});
	});
});

//현재 위치 업데이트
router.put('/:_id/gps', function(req, res, next) {
	var _id = req.params._id;
	var gps = {
		"lat": req.body.gpsLat,
		"lng": req.body.gpsLng
	};
	
	userDB.findById(_id, function(err, userDoc) {
		gpsDB.update({
			"user_id": _id
		}, {
			"user_id": _id,
			"location": gps,
			"name": userDoc.name,
			"profileUrl": userDoc.profileUrl
		}, {
			upsert: true
		}, function(err, doc) {
			if(err) {
				res.json({
					"status": 204
				});
			}
			else {
				console.info("GPS정보 업데이트 완료\n", doc);
				res.json({
					"status": 200,
					"data": doc
				});
			}
		});
	});
});

//유저 출발지
router.post('/:_id/source', function(req, res, next) {
	var user_id = req.params._id;
	var plan_id = req.body.plan_id;
	var src = {
		"lat": req.body.srcLat,
		"lng": req.body.srcLng
	}
	var srcName = req.body.srcName;
	
	srcDB.create({
		"user_id": user_id,
		"plan_id": plan_id,
		"src": src,
		"srcName": srcName
	}, function(err, doc) {
		if(err) {
			console.log(err);
			res.json({
				"status": 204
			});
		}
		else {
			console.info(user_id, "출발지 생성 완료\n", doc);
			res.json({
				"status": 200,
				"data": doc
			});
		}
	});
});

router.get('/:_id/source', function(req, res, next) {
	var user_id = req.params._id;
	
	srcDB.findById(user_id, function(err, doc) {
		if(err) {
			console.log(err);
			res.json({
				"status": 204
			});
		}
		else {
			console.info("출발지 목록 조회 완료\n", doc);
			res.json({
				"status": 200,
				"data": doc
			});
		}
	});
});

module.exports = router;
