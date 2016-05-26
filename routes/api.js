var express = require('express');
var router = express.Router();
var jsParser = require('../lib/general')

/* GET home page. */
router.get('/', function(req, res, next) {
    var xml = new jsParser("http://openapi.seoul.go.kr:8088/645a4243536a6b6237354c666d586e/xml/CardSubwayStatsNew/1/5/20151101");
    res.send("Json: " + xml.getJson());
});

router.get('/ridefilter', function(req, res, next) {
	 var parser = new jsParser("http://dev.odsay.com/Denny_test/appleTree/v1/0/Path/PathSearch_Exit.asp?Output=json&Echo=yes&Output=json&SX=127.0414533&SY=37.5551612&EX=126.9401193&EY=37.5597722&OPT=0&svcID=56f14f5c5ed77cdf26fec5f852c54abe");
	 var peopleParser = new Array;;
	 var time =['ONE_RIDE_NUM', 'TWO_RIDE_NUM', 'THREE_RIDE_NUM', 'FOUR_RIDE_NUM', 'FIVE_RIDE_NUM', 'SIX_RIDE_NUM', 'SEVEN_RIDE_NUM', 'EIGHT_RIDE_NUM', 'NINE_RIDE_NUM', 'TEN_RIDE_NUM', 'ELEVEN_RIDE_NUM', 'TWELVE_RIDE_NUM', 'THIRTEEN_RIDE_NUM', 'FOURTEEN_RIDE_NUM', 'FIFTEEN_RIDE_NUM', 'SIXTEEN_RIDE_NUM', 'SEVENTEEN_RIDE_NUM', 'EIGHTEEN_RIDE_NUM', 'NINETEEN_RIDE_NUM', 'TWENTY_RIDE_NUM', 'TWENTY_ONE_RIDE_NUM', 'TWENTY_TWO_RIDE_NUM', 'TWENTY_THREE_RIDE_NUM', 'MIDNIGHT_RIDE_NUM'];
	 var path = parser.getJson().result.path;
	 var result = new Array;
	 
	 for(var i = 0; i < path.length; i++)
	 {
		 if(path[i].pathType == 1)
		 {
			 for(var j = 0; j < path[i].subPath.length; j++)
			 {
				 if(path[i].subPath[j].trafficType == 1)
				 {
					 peopleParser = new jsParser("http://openapi.seoul.go.kr:8088/645a4243536a6b6237354c666d586e/json/CardSubwayTime/1/5/201603/"  + encodeURI(encodeURIComponent(path[i].subPath[j].lane[0].subwayCode) +"호선/")+encodeURIComponent(path[i].subPath[j].startName));
					 console.log("kb s", peopleParser.getSubwayPeople(time[7]));
					 if(peopleParser.getSubwayPeople(time[7]) == "passed")
					 {
						 result.push(path[i]);
					 }
					 break;
				 }
			 }
			
		 }
		 if(path[i].pathType == 2)
		 {
			 for(var j = 0; j < path[i].subPath.length; j++)
			 {
				 if(path[i].subPath[j].trafficType == 2)
				 {
					 peopleParser = new jsParser("http://openapi.seoul.go.kr:8088/645a4243536a6b6237354c666d586e/json/CardBusTimeNew/1/100/201603/"  + encodeURI(encodeURIComponent(path[i].subPath[j].lane[0].busNo)));
					 console.log("kb b", peopleParser.getBusPeople(path[i].subPath[j].startName, time[7]));
					 if(peopleParser.getBusPeople(path[i].subPath[j].startName, time[7]) == "passed")
					 {
						 result.push(path[i]);
					 }
					 break;
				 } 
			 }

		 }
	 }
	 
	 res.send(result);
});

module.exports = router;