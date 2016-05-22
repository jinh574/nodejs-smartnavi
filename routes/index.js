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
<<<<<<< HEAD
		//test
=======
>>>>>>> c81be18545f4fe95c130db765a525f4a1810b39b
	}
	else {
		res.sendStatus(404);
	}
});

module.exports = router;