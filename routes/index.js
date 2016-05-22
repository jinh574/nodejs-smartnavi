var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/webhook', function(req, res, next) {
	if(req.header('x-gitlab-token') === "starnight") {
		exec('.deploy.sh');
		res.sendStatus(200)
	}
	else {
		res.sendStatus(404);
	}
});

module.exports = router;