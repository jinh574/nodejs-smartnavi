var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: '뚜벅초 프로토타입' });
});

module.exports = router;
