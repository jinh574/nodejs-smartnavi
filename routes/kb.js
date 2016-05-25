var express = require('express');
var router = express.Router();
var jsParser = require('../lib/kb')

/* GET home page. */
router.get('/', function(req, res, next) {
//  res.render('kb', { title: '웹기술및응용', name : 'Team9' });
//	func.func('정국빈');
	 var parser = new jsParser("http://dev.odsay.com/Denny_test/appleTree/v1/0/Path/PathSearch_Exit.asp?Output=json&Echo=yes&Output=json&SX=127.0414533&SY=37.5551612&EX=126.9401193&EY=37.5597722&OPT=0&svcID=56f14f5c5ed77cdf26fec5f852c54abe");
	 var peopleParser = new Array;;
	 var time =['ONE_RIDE_NUM', 'TWO_RIDE_NUM', 'THREE_RIDE_NUM', 'FOUR_RIDE_NUM', 'FIVE_RIDE_NUM'];
	 var date = new Date();
	 var day = date.getDay();
	 var hour = date.getHours();
	 var path = parser.getJson().result.path;
	 var subway = new Array;
	 var startName = new Array;
	 
	 for(var i = 0; i < path.length; i++)
	 {
		 if(path[i].pathType == 1)
		 {
			 for(var j = 0; j < path[i].subPath.length; j++)
			 {
				 if(path[i].subPath[j].trafficType == 1)
				 {
					 subway.push(path[i].subPath[j].lane[0].subwayCode);
					 startName.push(path[i].subPath[j].startName);
					 break;
				 }
			 }
		 }
	 }
	 for(var i=0;i<subway.length;i++)
		 {
		 peopleParser = new jsParser("http://openapi.seoul.go.kr:8088/645a4243536a6b6237354c666d586e/json/CardSubwayTime/1/5/201603/"  + encodeURI(encodeURIComponent(subway[i]) +"호선/")+encodeURIComponent(startName[i]));
		 
		 console.log(peopleParser.getPeople(time[4]));
		 }
	 //console.log(subway[1], startName[1]);
	 //console.log("http://openapi.seoul.go.kr:8088/645a4243536a6b6237354c666d586e/json/CardSubwayTime/1/5/201603/"  + subway[1]+"호선/"+startName[1]);
	 //peopleParser = new jsParser("http://openapi.seoul.go.kr:8088/645a4243536a6b6237354c666d586e/json/CardSubwayTime/1/5/201603/"  + encodeURI(encodeURIComponent(subway[1]+"호선/"))+encodeURIComponent(startName[1]));
	 //console.log(peopleParser.getPeople(time[4]));
	 
//	 for(var i=0;i<way.length;i++)
//		 {
//		 peopleParser = new jsParser("http://openapi.seoul.go.kr:8088/645a4243536a6b6237354c666d586e/json/CardSubwayTime/1/5/201603/" + way[i] + "호선" + startName[i]); 
//		 console.log(peopleParser.getPeople(time[5]));
//		 
//		 }
	 console.log(path);
	// 
	 res.send(parser.getJson());
	 //for(var i = 0; i < )
	 
	 


});

router.get('/sg', function(req, res, next) {
	  res.render('kbsg', { title: '웹기술및응용', name : '몽둥길' });
	});

module.exports = router;