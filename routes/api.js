var express = require('express');
var router = express.Router();
var jsParser = require('../lib/general')

/* GET home page. */
router.get('/', function(req, res, next) {
    var xml = new jsParser("http://openapi.seoul.go.kr:8088/645a4243536a6b6237354c666d586e/xml/CardSubwayStatsNew/1/5/20151101");
    res.send("Json: " + xml.getJson());
});

module.exports = router;