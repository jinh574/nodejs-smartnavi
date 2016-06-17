var jsParser = require('./general');
var sync = require('synchronize');

exports.normalFilter = function(sx, sy, ex, ey, callback)
{
	var parser = new jsParser("http://dev.odsay.com/Denny_test/appleTree/v1/0/Path/PathSearch_Exit.asp?Output=json&Echo=yes&Output=json&SX=" + sx + "&SY=" + sy + "&EX=" + ex + "&EY=" + ey + "&OPT=0&svcID=56f14f5c5ed77cdf26fec5f852c54abe");
	/*
	var path = parser.getJson(function(data) {
		
	}).result.path;
	*/
	parser.getJson(function(data) {
		callback(data.result.path);
	});
	
	//return path;
};

exports.rideFilter = function(sx, sy, ex, ey, year, month, hour, callback)
{
	var parser = new jsParser("http://dev.odsay.com/Denny_test/appleTree/v1/0/Path/PathSearch_Exit.asp?Output=json&Echo=yes&Output=json&SX=" + sx + "&SY=" + sy + "&EX=" + ex + "&EY=" + ey + "&OPT=0&svcID=56f14f5c5ed77cdf26fec5f852c54abe");
	var peopleParser;
	var time =['ONE_RIDE_NUM', 'TWO_RIDE_NUM', 'THREE_RIDE_NUM', 'FOUR_RIDE_NUM', 'FIVE_RIDE_NUM', 'SIX_RIDE_NUM', 'SEVEN_RIDE_NUM', 'EIGHT_RIDE_NUM', 'NINE_RIDE_NUM', 'TEN_RIDE_NUM', 'ELEVEN_RIDE_NUM', 'TWELVE_RIDE_NUM', 'THIRTEEN_RIDE_NUM', 'FOURTEEN_RIDE_NUM', 'FIFTEEN_RIDE_NUM', 'SIXTEEN_RIDE_NUM', 'SEVENTEEN_RIDE_NUM', 'EIGHTEEN_RIDE_NUM', 'NINETEEN_RIDE_NUM', 'TWENTY_RIDE_NUM', 'TWENTY_ONE_RIDE_NUM', 'TWENTY_TWO_RIDE_NUM', 'TWENTY_THREE_RIDE_NUM', 'MIDNIGHT_RIDE_NUM'];
	// var path = parser.getJson().result.path;
	var yyyymm = year * 100 + month - 1;
	var path;
	var result = new Array;
	var doneCount = 0;
	
	parser.getJson(function(data) 
	{
		path = data.result.path;
		for(var i = 0; i < path.length; i++)
		{
			//console.log(doneCount);
			if(path[i].pathType == 1)
			{
				for(var j = 0; j < path[i].subPath.length; j++)
				{
					if(path[i].subPath[j].trafficType == 1)
					{
						peopleParser = new jsParser("http://openapi.seoul.go.kr:8088/645a4243536a6b6237354c666d586e/json/CardSubwayTime/1/5/" + encodeURI(encodeURIComponent(yyyymm)) + "/"  + encodeURI(encodeURIComponent(path[i].subPath[j].lane[0].subwayCode) +"호선/")+encodeURIComponent(path[i].subPath[j].startName));
						
						doneCount++;
						peopleParser.setI(i, j);
						peopleParser.getJson(function(json) {
							peopleParser.getSubwayPeople(time[hour - 1], json, function(ptr, last_data) {
								if(last_data == "passed") {
									result.push(path[ptr]);
								}
								if(--doneCount == 0 && i == path.length) {
									callback(result);
								}
							});
						});
						break;
					}
				}			
			}
			else if(path[i].pathType == 2)
			{
				for(var j = 0; j < path[i].subPath.length; j++)
				{
					if(path[i].subPath[j].trafficType == 2)
					{
						peopleParser = new jsParser("http://openapi.seoul.go.kr:8088/645a4243536a6b6237354c666d586e/json/CardBusTimeNew/1/100/" + encodeURI(encodeURIComponent(yyyymm)) + "/" + encodeURI(encodeURIComponent(path[i].subPath[j].lane[0].busNo)));

						doneCount++;
						peopleParser.setI(i, j);
						peopleParser.getJson(function(json, ptr_i, ptr_j) {
							peopleParser.getBusPeople(path[ptr_i].subPath[ptr_j].startName, time[hour - 1], json, function(ptr, last_data) {
								if(last_data == "passed") {
									result.push(path[ptr]);
								}
								if(--doneCount == 0 && i == path.length) {
									callback(result);
								}
							});	
						});
						break;
					} 
				}
			}
			else if(path[i].pathType == 3)
			{
				for(var j = 0; j < path[i].subPath.length; j++)
				{
					if(path[i].subPath[j].trafficType == 1)
					{
						peopleParser = new jsParser("http://openapi.seoul.go.kr:8088/645a4243536a6b6237354c666d586e/json/CardSubwayTime/1/5/" + encodeURI(encodeURIComponent(yyyymm)) + "/"  + encodeURI(encodeURIComponent(path[i].subPath[j].lane[0].subwayCode) +"호선/")+encodeURIComponent(path[i].subPath[j].startName));

						doneCount++;
						peopleParser.setI(i, j);
						peopleParser.getJson(function(json) {
							peopleParser.getSubwayPeople(time[hour - 1], json, function(ptr, last_data) {
								if(last_data == "passed") {
									result.push(path[ptr]);
								}
								if(--doneCount == 0 && i == path.length) {
									callback(result);
								}
							});	
						});						
						break;
					}
					else if(path[i].subPath[j].trafficType == 2)
					{
						peopleParser = new jsParser("http://openapi.seoul.go.kr:8088/645a4243536a6b6237354c666d586e/json/CardBusTimeNew/1/100/" + encodeURI(encodeURIComponent(yyyymm)) + "/" + encodeURI(encodeURIComponent(path[i].subPath[j].lane[0].busNo)));

						doneCount++;
						peopleParser.setI(i, j);
						peopleParser.getJson(function(json, ptr_i, ptr_j) {
							peopleParser.getBusPeople(path[ptr_i].subPath[ptr_j].startName, time[hour - 1], json, function(ptr, last_data) {
								if(last_data == "passed") {
									result.push(path[ptr]);
								}
								if(--doneCount == 0 && i == path.length) {
									callback(result);
								}
							});	
						});
						break;
					} 
				}
			}
		}
	});
};



exports.checkAccident = function(srcx, srcy, acix, aciy)
{
	var radsrcy = Math.PI * srcy / 180;
	var radaciy = Math.PI * aciy / 180;
	var theta = srcx - acix;
	var radtheta = Math.PI * theta / 180;
	
	var dist = Math.sin(radsrcy) * Math.sin(radaciy) + Math.cos(radsrcy) * Math.cos(radaciy) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180 / Math.PI;
	dist = dist * 60 * 1.1515;
	dist = dist * 1.609344;
	
	if(dist > 1)
	{
		return -1;
	}
	else
	{
		return 1;
	}
};