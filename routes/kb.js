var express = require('express');
var router = express.Router();
var func = require('../lib/kb.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('kb', { title: '웹기술및응용', name : 'Team9' });
	func.func('정국빈');
});

router.get('/sg', function(req, res, next) {
	  res.render('kbsg', { title: '웹기술및응용', name : '몽둥길' });
	});

module.exports = router;