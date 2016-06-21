var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var planDB = require('../lib/db_plans');
var userDB = require('../lib/db_users');
var srcDB = require('../lib/db_source');
var gpsDB = require('../lib/db_gps');

//전체 플랜 검색
router.get('/', function(req, res, next) {
	planDB.find({}, function(err, docs) {
		if(err) {
			console.log(err);
			res.json({"status": 204});
		}
		else {
			res.json({
				"status": 200,
				"data": docs
			});
		}
	});
});

//플랜 ID로 검색
router.get('/:_id', function(req, res, next) {
	var _id = req.params._id;
	planDB.findById(_id, function(err, doc) {
		if(err) {
			console.log(err);
			res.json({"status": 204});
		}
		else {
			res.json({
				"status": 200,
				"data": doc
			});
		}
	});
});

//플랜 추가
router.post('/', function(req, res, next) {
	var name = req.body.name;
	var creator = req.body.creator;
	var dest = {
		"lat": req.body.destLat,
		"lng": req.body.destLng
	}
	var destName = req.body.destName;
	var timestamp = req.body.timestamp * 1000;
	var timestamp2 = req.body.timestamp2 * 1000;

	planDB.create({
		"name": name,
		"creator": creator,
		"dest": dest,
		"destName": destName,
		"timestamp": timestamp,
		"timestamp2": timestamp2
	}, function(err, doc) {
		if(err) {
			console.log(err);
			res.json({"status": 204});
		}
		else {
			console.info("플랜 생성 완료\n", doc);
			res.json({
				"status": 200,
				"data": doc._id
			});
		}
	});
});

//플랜 친구 추가
router.put('/:_id', function(req, res, next) {
	var _id = req.params._id;
	var friends = req.body.friends;

	planDB.findById(_id, function(err, doc) {
		if(err) {
			console.log(err);
			res.json({
				"status": 204
			});
		}
		else {
			if(doc) {
				if(doc.friends.indexOf(friends) == -1) {
					doc.friends.push(friends);
					doc.save(function (err, saveDoc) {
						res.json({
							"status": 200,
							"data": saveDoc
						});
					});
				}
				else {
					res.json({
						"status": 204,
						"message": "이미 추가 되어있습니다."
					})
				}
			}
			else {
				res.json({
					"status": 204,
					"message": "플랜ID가 존재하지 않습니다."
				});
			}
		}
	});
});

//플랜 삭제 또는 초대친구 삭제
router.delete('/:_id', function(req, res, next) {
	var _id = req.params._id;
	var friends = req.body.friends;

	if(friends) {
		planDB.findById(_id, function(err, doc) {
			var index;
			if((index = doc.friends.indexOf(friends)) != -1) {
				doc.friends.splice(index, 1);
				doc.save(function(err, saveDoc) {
					console.info("플랜 초대친구 삭제 완료\n", friends);
					res.json({
						"status": 200,
						"data": doc
					});
				});
			}
			else {
				console.log(index);
				res.json({
					"status": 200,
					"message": "플랜에 friends가 존재하지 않습니다."
				})
			}
		});
	}
	else {
		planDB.findById(_id).remove(function (err, doc) {
			if (err) {
				console.log(err);
				res.json({
					"status": 204
				});
			}
			else {
				if (doc) {
					console.info("플랜 삭제 완료\n", _id);
					res.json({
						"status": 200,
						"data": doc
					});
				}
			}
		});
	}
});

//플랜 출발지 추가
router.post('/:_id/source', function(req, res, next) {
	var _id = req.params._id;
	var user_id = req.body.user_id;
	var src = {
		"lat": req.body.srcLat,
		"lng": req.body.srcLng
	};
	var srcName = req.body.srcName;
	var current = req.body.current;
	
	srcDB.create({
		"plan_id": _id,
		"user_id": user_id,
		"src": src,
		"srcName": srcName,
		"current": current
	}, function(err, doc) {
		if(err) {
			console.log(err);
			res.json({
				"status": 204
			});
		}
		else {
			console.info(user_id, "출발지 추가 완료\n", doc);
			res.json({
				"status": 200,
				"data": doc
			});
		}
	});
});

//플랜 출발지 리스트
router.get('/:_id/source/:user_id', function(req, res, next) {
	var _id = req.params._id;
	var user_id = req.params.user_id;
	
	srcDB.find({
		"plan_id": _id,
		"user_id": user_id
	}, function(err, docs) {
		if(err) {
			console.log(err);
			res.json({
				"status": 204
			});
		}
		else {
			if(docs.length) {
				console.info("출발지 조회 완료\n", docs[0]);
				res.json({
					"status": 200,
					"data": docs[0]
				});
			}
			else {
				console.info("출발지 없음");
				res.json({
					"status": 204,
					"description": "출발지 없음"
				})
			}
		}
	}).sort({ "_id": -1});
});

//플랜 GPS 목록 조회
router.get('/:_id/gps', function(req, res, next) {
	var _id = req.params._id;
	var result = [];
	var tmp;
	planDB.findById(_id, function(err, doc) {
		tmp = doc.friends;
		tmp.push(doc.creator);
		console.log(tmp);
		gpsDB.find( { "user_id": { $in : tmp } }, function(err, docs) {
			if(err) {
				console.log(err);
				res.json({
					"status": 204
				});
			}
			else {
				console.info(_id + " GPS정보 조회 완료");
				res.json({
					"status": 200,
					"data": docs
				});
			}
		});
	});
});

module.exports = router;