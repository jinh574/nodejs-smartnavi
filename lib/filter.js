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


exports.makeAccidentData = function(path,callback)
{
	var stationX;
	var stationY;
	var stopFlag=0;
	var popIndex = new Array();
	var count=0;
	var minX=0;
	var minY=0;
	var maxX=0;
	var maxY=0;
	var reqData=0;
	var storeAccid = new Array();
	var chooseAccid = new Array();
	
	for(var i=0;i<pathArray.subPath.length;i++)
	{
		if(pathArray.subPath[i].trafficType==2)
			count ++;
	}//버스 정류장을 모두 구하는 for문	
	
	
	if(pathArray.info.busStationCount!=0)
	{
	
		for(var j = 0;(j<pathArray.subPath.length)&&(stopFlag == 0);j++)
		{
			if(pathArray.subPath[j].trafficType==2)
			{
				for(var k=0;k<pathArray.subPath[j].passStopList.stations.length;k++)
				{
					if(k==0)
					{
						minX=maxX=pathArray.subPath[j].passStopList.stations[k].x;
						minY=maxY=pathArray.subPath[j].passStopList.stations[k].y;
					}
					else
					{
						if(pathArray.subPath[j].passStopList.stations[k].x>maxX)
						{
							maxX=pathArray.subPath[j].passStopList.stations[k].x;
						}
						
						if(pathArray.subPath[j].passStopList.stations[k].x < minX)
						{
							minX=pathArray.subPath[j].passStopList.stations[k].x;
						}
						
						if(pathArray.subPath[j].passStopList.stations[k].y>maxY)
						{
							maxY=pathArray.subPath[j].passStopList.stations[k].y;
						}
						
						if(pathArray.subPath[j].passStopList.stations[k].y < minY)
						{
							minY=pathArray.subPath[j].passStopList.stations[k].y;
						}
					}
				}			
				console.log("max X"+maxX+"max Y"+maxY+"min X"+minX+"min Y"+minY);
				var parser = new jsParser("https://apis.skplanetx.com/tmap/traffic?sort=&centerLon=&centerLat=&minLat="+minY+"&maxLon="+maxX+"&version=1&trafficType=ACC&maxLat="+maxY+"&minLon="+minX+"&reqCoordType=WGS84GEO&callback=&zoomLevel=13&radius=&resCoordType=WGS84GEO&appKey=a717d1c3-47d3-39c2-8475-38e2e608cf06");
				parser.getJson(function(data) {
					console.log(data);
					storeAccid.push(data);
					count--;
					if(count==0)
					{
						var storeAccidIndex = 0;
						for(var i = 0;i<pathArray.subPath.length;i++)//서브 패스를 다 돌아보기
						{
							if(pathArray.subPath[i].trafficType==2)//서브패스가 버스 타입이면
							{
								for(var k=0;k<pathArray.subPath[i].passStopList.stations.length;k++)//버스 정류소 다 돌기
								{
									if(k+1<pathArray.subPath[i].passStopList.stations.length)//버스 정류소 맨마지막은 계산하지 않기
									{
										if(!(storeAccid[storeAccidIndex].hasOwnProperty("error")))
										{
											storeAccid[storeAccidIndex].features.forEach(function(item,index,array){//빋이온 정보
												if(item.properties.congestion>0)//혼잡스러운 곳이면
												{
													var compX=item.geometry.coordinates[1][0];
													var compY=item.geometry.coordinates[1][1];
													
													//이부분에서 이제 사고 데이터를 뽑아준다.
								
													
													
													if(pathArray.subPath[i].passStopList.stations[k].x<pathArray.subPath[i].passStopList.stations[k+1].x && pathArray.subPath[i].passStopList.stations[k].y<pathArray.subPath[i].passStopList.stations[k+1].y && stopFlag==0)
													{
														// k.x<k+1.x && k.y<k+1.y
														
														if(pathArray.subPath[i].passStopList.stations[k].x<=compX && pathArray.subPath[i].passStopList.stations[k+1].x>=compX &&
																 pathArray.subPath[i].passStopList.stations[k].y<=compY && pathArray.subPath[i].passStopList.stations[k+1].y>=compY)
														{
															chooseAccid.push(item);
															console.log("삭제");
														}
													}
													else if(pathArray.subPath[i].passStopList.stations[k].x<pathArray.subPath[i].passStopList.stations[k+1].x && pathArray.subPath[i].passStopList.stations[k].y > pathArray.subPath[i].passStopList.stations[k+1].y && stopFlag==0)
													{
														// k.x<k+1.x && k.y>k+1.y
														
														if(pathArray.subPath[i].passStopList.stations[k].x<=compX && pathArray.subPath[i].passStopList.stations[k+1].x>=compX &&
																 pathArray.subPath[i].passStopList.stations[k].y>=compY && pathArray.subPath[i].passStopList.stations[k+1].y<=compY)
														{
															chooseAccid.push(item);
															console.log("삭제");
														}
													}
													else if(pathArray.subPath[i].passStopList.stations[k].x>pathArray.subPath[i].passStopList.stations[k+1].x && pathArray.subPath[i].passStopList.stations[k].y < pathArray.subPath[i].passStopList.stations[k+1].y && stopFlag==0)
													{
														// k.x>k+1.x && k.y<k+1.y
														
														if(pathArray.subPath[i].passStopList.stations[k].x>=compX && pathArray.subPath[i].passStopList.stations[k+1].x<=compX &&
																 pathArray.subPath[i].passStopList.stations[k].y<=compY && pathArray.subPath[i].passStopList.stations[k+1].y>=compY)
														{
															chooseAccid.push(item);
															console.log("삭제");
														}
													}
													else if(pathArray.subPath[i].passStopList.stations[k].x>pathArray.subPath[i].passStopList.stations[k+1].x && pathArray.subPath[i].passStopList.stations[k].y > pathArray.subPath[i].passStopList.stations[k+1].y && stopFlag==0)
													{
														// k.x>k+1.x && k.y>k+1.y
													
														if(pathArray.subPath[i].passStopList.stations[k].x>=compX && pathArray.subPath[i].passStopList.stations[k+1].x<=compX &&
																 pathArray.subPath[i].passStopList.stations[k].y>=compY && pathArray.subPath[i].passStopList.stations[k+1].y<=compY)
														{
															chooseAccid.push(item);
															console.log("삭제");
														}
													}
												} 
											});
										}	
									}
								}//
								storeAccidIndex++;
							}
						}

						callback(chooseAccid);
					}
				});
			}
		}
	}
	else
	{
		callback(null);
	}
}

exports.checkAccident = function(pathArray,callback)
{
	
	var stationX;
	var stationY;
	var stopFlag=0;
	var popIndex = new Array();
	var count=0;
	
	var minX=0;
	var minY=0;
	var maxX=0;
	var maxY=0;
	var reqData=0;
	var storeAccid = new Array();
	
	for(var i=0;i<pathArray.subPath.length;i++)
	{
		if(pathArray.subPath[i].trafficType==2)
			count ++;
	}//버스 정류장을 모두 구하는 for문	
	
	
	if(pathArray.info.busStationCount!=0)
	{
	
		for(var j = 0;(j<pathArray.subPath.length)&&(stopFlag == 0);j++)
		{
			if(pathArray.subPath[j].trafficType==2)
			{
				for(var k=0;k<pathArray.subPath[j].passStopList.stations.length;k++)
				{
					if(k==0)
					{
						minX=maxX=pathArray.subPath[j].passStopList.stations[k].x;
						minY=maxY=pathArray.subPath[j].passStopList.stations[k].y;
					}
					else
					{
						if(pathArray.subPath[j].passStopList.stations[k].x>maxX)
						{
							maxX=pathArray.subPath[j].passStopList.stations[k].x;
						}
						
						if(pathArray.subPath[j].passStopList.stations[k].x < minX)
						{
							minX=pathArray.subPath[j].passStopList.stations[k].x;
						}
						
						if(pathArray.subPath[j].passStopList.stations[k].y>maxY)
						{
							maxY=pathArray.subPath[j].passStopList.stations[k].y;
						}
						
						if(pathArray.subPath[j].passStopList.stations[k].y < minY)
						{
							minY=pathArray.subPath[j].passStopList.stations[k].y;
						}
					}
				}			
				console.log("max X"+maxX+"max Y"+maxY+"min X"+minX+"min Y"+minY);
				var parser = new jsParser("https://apis.skplanetx.com/tmap/traffic?sort=&centerLon=&centerLat=&minLat="+minY+"&maxLon="+maxX+"&version=1&trafficType=ACC&maxLat="+maxY+"&minLon="+minX+"&reqCoordType=WGS84GEO&callback=&zoomLevel=13&radius=&resCoordType=WGS84GEO&appKey=a717d1c3-47d3-39c2-8475-38e2e608cf06");
				parser.getJson(function(data) {
					console.log(data);
					storeAccid.push(data);
					count--;
					if(count==0)
					{
						var storeAccidIndex = 0;
						for(var i = 0;i<pathArray.subPath.length&&stopFlag==0;i++)//서브 패스를 다 돌아보기
						{
							if(pathArray.subPath[i].trafficType==2)//서브패스가 버스 타입이면
							{
								for(var k=0;k<pathArray.subPath[i].passStopList.stations.length&&stopFlag==0;k++)//버스 정류소 다 돌기
								{
									if(k+1<pathArray.subPath[i].passStopList.stations.length)//버스 정류소 맨마지막은 계산하지 않기
									{
										if(!(storeAccid[storeAccidIndex].hasOwnProperty("error")))
										{
											storeAccid[storeAccidIndex].features.forEach(function(item,index,array){//빋이온 정보
												if(item.properties.congestion>1)//혼잡스러운 곳이면
												{
													var compX=item.geometry.coordinates[1][0];
													var compY=item.geometry.coordinates[1][1];
													if(pathArray.subPath[i].passStopList.stations[k].x<pathArray.subPath[i].passStopList.stations[k+1].x && pathArray.subPath[i].passStopList.stations[k].y<pathArray.subPath[i].passStopList.stations[k+1].y && stopFlag==0)
													{
														// k.x<k+1.x && k.y<k+1.y
														
														if(pathArray.subPath[i].passStopList.stations[k].x<=compX && pathArray.subPath[i].passStopList.stations[k+1].x>=compX &&
																 pathArray.subPath[i].passStopList.stations[k].y<=compY && pathArray.subPath[i].passStopList.stations[k+1].y>=compY)
														{
															stopFlag=1;	 
															console.log("삭제");
														}
													}
													else if(pathArray.subPath[i].passStopList.stations[k].x<pathArray.subPath[i].passStopList.stations[k+1].x && pathArray.subPath[i].passStopList.stations[k].y > pathArray.subPath[i].passStopList.stations[k+1].y && stopFlag==0)
													{
														// k.x<k+1.x && k.y>k+1.y
														
														if(pathArray.subPath[i].passStopList.stations[k].x<=compX && pathArray.subPath[i].passStopList.stations[k+1].x>=compX &&
																 pathArray.subPath[i].passStopList.stations[k].y>=compY && pathArray.subPath[i].passStopList.stations[k+1].y<=compY)
														{
															stopFlag=1;	 
															console.log("삭제");
														}
													}
													else if(pathArray.subPath[i].passStopList.stations[k].x>pathArray.subPath[i].passStopList.stations[k+1].x && pathArray.subPath[i].passStopList.stations[k].y < pathArray.subPath[i].passStopList.stations[k+1].y && stopFlag==0)
													{
														// k.x>k+1.x && k.y<k+1.y
														
														if(pathArray.subPath[i].passStopList.stations[k].x>=compX && pathArray.subPath[i].passStopList.stations[k+1].x<=compX &&
																 pathArray.subPath[i].passStopList.stations[k].y<=compY && pathArray.subPath[i].passStopList.stations[k+1].y>=compY)
														{
															stopFlag=1;	 
															console.log("삭제");
														}
													}
													else if(pathArray.subPath[i].passStopList.stations[k].x>pathArray.subPath[i].passStopList.stations[k+1].x && pathArray.subPath[i].passStopList.stations[k].y > pathArray.subPath[i].passStopList.stations[k+1].y && stopFlag==0)
													{
														// k.x>k+1.x && k.y>k+1.y
													
														if(pathArray.subPath[i].passStopList.stations[k].x>=compX && pathArray.subPath[i].passStopList.stations[k+1].x<=compX &&
																 pathArray.subPath[i].passStopList.stations[k].y>=compY && pathArray.subPath[i].passStopList.stations[k+1].y<=compY)
														{
															stopFlag=1;	 
															console.log("삭제");
														}
													}
												} 
											});
										}	
									}
								}//
								storeAccidIndex++;
							}
						}

						callback(stopFlag);
					}
				});
			}
		}
	}
	else
	{
		callback(stopFlag);
	}
};


exports.frCodeReturn = function(stationName,callback)
{
	var fs = require('fs');
	console.log("station Name : "+stationName);
	fs.readFile('data/subway_info.json', 'utf8', function(err, data) {
		if(err) throw err;
		dataInfo = JSON.parse(data);
		dataInfo = dataInfo.DATA;
		for(var i = 0; i < dataInfo.length; i++) {
			if(dataInfo[i].STATION_NM == stationName) {
				callback(dataInfo[i].FR_CODE);
				console.log(dataInfo[i].FR_CODE);
				return;
			}
		}
		/*
		var findFr = dataInfo.DATA.filter(function(x) {
			if(x.STATION_NM == stationName) {
				fr_code = x.FR_CODE;
				console.log("fr_code : "+fr_code);
				callback(fr_code);
			}
		});
		*/
	});
};