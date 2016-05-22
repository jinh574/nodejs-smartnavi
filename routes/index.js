var express = require('express');
var resolve = require('resolve-app-path');
var exec = require('child_process').exec;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/webhook', function(req, res, next) {
	if(req.header('x-gitlab-token') === "starnight") {
		var script = exec(resolve() + "/deploy.bat");
		script.stdout.on('data', function(data) {
			console.log(data);
		});
		res.sendStatus(200)
		//test
	}
	else {
		res.sendStatus(404);
	}
});

module.exports = router;
