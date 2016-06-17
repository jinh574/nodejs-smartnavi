var xml2js = require('xml2js');
var http = require('http');
var testing = require('../lib/general');
var filter = require('../lib/filter');
var async = require('async');

exports.test=function asd(name)
{
	console.log(name);
};

exports.searchddRoute=function searchddRoute(parser_txt)
{
	return parser_txt.result.path;
};


exports.normalPath = function normalPath(start_x,start_y,des_x,des_y,callback)
{
	var result=new Array();
	filter.normalFilter(start_x,start_y,des_x,des_y, function(data) {
		for(var i=0;i<data.length;i++)
		{
	//		for(var j=1;j<rtn[i].subPath.length;j++)
	//		{
	//			result.push ( rtn[i].subPath[j].passStopList);
	//		}
			result.push(data[i].subPath);
		}
		callback(result);
	});
};

exports.filterPath = function filterPath(start_x,start_y,des_x,des_y,year,month,hour,callback)
{
	var result=new Array();
	filter.rideFilter(start_x,start_y,des_x,des_y,year,month,hour, function(data) {
		for(var i=0;i<data.length;i++)
		{
	//		for(var j=1;j<rtn[i].subPath.length;j++)
	//		{
	//			result.push ( rtn[i].subPath[j].passStopList);
	//		}
			result.push(data[i].subPath);
		}
		callback(result);
	});

	return result;
};
exports.filterPath2 = function filerPath2(start_x,start_y,des_x,des_y,year,month,hour)
{
	var rtn = filter.rideFilter(start_x,start_y,des_x,des_y,year,month,hour);
	var route = new Array;
	var routeOrder;
	
	for(var i=0;i<rtn.length;i++)
	{
		routeOrder = new Array;
		for(var j=0;j<rtn[i].subPath.length;j++)
		{
			routeOrder.push(rtn[i].subPath[j].passStopList);
		}
		route.push(routeOrder);
	}
	
	return routeOrder;
}

exports.getAcidPOI=function getAcidPOI(position,acix, aciy)
{
	var MinX=position[0].x,MaxX=0,MinY=position[0].y,MaxY=0;
	
	for(var i=0;i<position.length;i++)
	{
		if(position[i].x<MinX)
		{
			MinX=position[i].x;
		}
		else if(position[i].x>MaxX)
		{
			MaxX=position[i].x;
		}
		
		if(position[i].y<MinY)
		{
			MinY=position[i].y;
		}
		else if(position[i].y>MaxY)
		{
			MaxY=position[i].y;
		}
	}
	var paser  = new testing("http://openapi.its.go.kr/api/NIncidentIdentity?key=1464090469922&ReqType=2&MinX="+MinX+"&MaxX="+MaxX+"&MinY="+MinY+"&MaxY="+MaxY+"&type=its");
	var rtn = parser.getJson();
	console.log(rtn);
	filter.checkAcciden(srcx.srcy,acix,aciy);
};

/*exports.searchRoute2=function(srcLat,srcLng,dstLat,dstLng,callback)
{
	//var parser = new testing ("http://dev.odsay.com/Denny_test/appleTree/v1/0/Path/PathSearch_Exit.asp?Echo=yes&Output=json&SX="+srcLng+"&SY="+srcLat+"&EX="+dstLng+"&EY="+dstLat+"&OPT=0&svcID=56f14f5c5ed77cdf26fec5f852c54abe");
	console.log(srcLat);//x
	console.log(srcLng);//y
	var parser = new testing ("http://dev.odsay.com/denny_test/appletree/v1/0/POI/PointSearch.asp?Echo=yes&Output=Json&x="+srcLat+"&y="+srcLng+"&radius=500&svcID=56f14f5c5ed77cdf26fec5f852c54abe");
	var nearStation= parser.getJson();
	var count = nearStation.result.count;
	var parser2;
	var shortTime=new Array;
	
	
	
	for(var i=0;i<count;i++)
	{
		  parser= new testing("http://dev.odsay.com/Denny_test/appleTree/v1/0/Path/PathSearch_Exit.asp?Echo=yes&Output=Json&Output=Json&SX=" + nearStation.result.station[i].x + "&SY=" + nearStation.result.station[i].y + "&EX=126.9401193&EY=37.5597722&OPT=0&svcID=56f14f5c5ed77cdf26fec5f852c54abe");
		  var dis= parser.getJson(function(){
			   shortTime.push(dis.result.path[0]);
		  });
		 
	}
	
	callback(shortTime);
};*/


function result_func(callback,sortTime){
	console.log(sortTime);
	callback(shortTime);
}

exports.searchRoute2=function(srcLat,srcLng,dstLat,dstLng,callback)
{
	//var parser = new testing ("http://dev.odsay.com/Denny_test/appleTree/v1/0/Path/PathSearch_Exit.asp?Echo=yes&Output=json&SX="+srcLng+"&SY="+srcLat+"&EX="+dstLng+"&EY="+dstLat+"&OPT=0&svcID=56f14f5c5ed77cdf26fec5f852c54abe");
	console.log(srcLat);//x
	console.log(srcLng);//y
	var parser = new testing ("http://dev.odsay.com/denny_test/appletree/v1/0/POI/PointSearch.asp?Echo=yes&Output=Json&x="+srcLat+"&y="+srcLng+"&radius=500&svcID=56f14f5c5ed77cdf26fec5f852c54abe");
	var nearStation;
	parser.getJson(function(result){
	//	console.log(result);
		var parser2;
		var shortTime=new Array;
		var nearStationPOI=result.result.station;
		var count = result.result.count;
		var resultPath=new Array;
		console.log(nearStationPOI[0].x);
		console.log(nearStationPOI[0].y);
		
		
		nearStationPOI.forEach(function(item,index,array){
			console.log(item.x ,item.y);
			console.log("processing");
			//for(var i=0;i<1000000000;i++){i++;i++;i--;i--;}
			filter.rideFilter(item.x,item.y,126.9401193,37.5597722,2016,3,7,function(result){
				//console.log(result);
				//console.log("result");
				resultPath.push(result);
				console.log("result");
				count--;
				if(count==0)
				{
					console.log("end");
					console.log(resultPath);
					callback(resultPath);
				}
			});

		});
		
	});

};

exports.searchRoute=function(srcLat,srcLng,dstLat,dstLng,callback)
{
	//var parser = new testing ("http://dev.odsay.com/Denny_test/appleTree/v1/0/Path/PathSearch_Exit.asp?Echo=yes&Output=json&SX="+srcLng+"&SY="+srcLat+"&EX="+dstLng+"&EY="+dstLat+"&OPT=0&svcID=56f14f5c5ed77cdf26fec5f852c54abe");
	console.log(srcLat);//x
	console.log(srcLng);//y
	var parser = new testing ("http://dev.odsay.com/denny_test/appletree/v1/0/POI/PointSearch.asp?Echo=yes&Output=Json&x="+srcLat+"&y="+srcLng+"&radius=500&svcID=56f14f5c5ed77cdf26fec5f852c54abe");
	var parser2;
	var nearStationPOI;
	var count;
	var resultPath=new Array;
	var finalResultPath = new Array;
	var selectPath = new Array;
	var transPath = new Array;
	var resultPath = new Array;
	var shorTimePath = new Array;
	var shorTransPath ;
	async.waterfall([
			function(callback){
				parser.getJson(function (result){
					nearStationPOI=result.result.station;
					count = result.result.count;
					callback(null);
				});
			},
			function(callback){
				nearStationPOI.forEach(function(item,index,array){
					
					//for(var i=0;i<1000000000;i++){i++;i++;i--;i--;}
					filter.rideFilter(item.x,item.y,126.9401193,37.5597722,2016,3,7,function(result){
						//console.log(result);
						//console.log("result");
						resultPath.push(result);
						count--;
						if(count==0)
						{
							console.log("end");
							//console.log(resultPath);
							callback(null);
						}
					});
				});
			},
			function (callback){
				//console.log(resultPath[0][0].info);
				resultPath.forEach(function(item,index,array){
					var len = item.length;
					
					if(1==len)
					{
						var info = new Object ();
						info.ind=selectPath.length;
						info.path=item[0];
						selectPath.push(info);
					}
					else if(2==len)
					{
						var info = new Object ();
						info.ind=selectPath.length;
						info.path=item[0];
						selectPath.push(info);
						
						var info = new Object ();
						info.ind=selectPath.length;
						info.path=item[1];
						selectPath.push(info);
					}
					else if(3<=len)
					{
						var info = new Object ();
						info.ind=selectPath.length;
						info.path=item[0];
						selectPath.push(info);
						
						var info = new Object ();
						info.ind=selectPath.length;
						info.path=item[1];
						selectPath.push(info);
						
						var info = new Object ();
						info.ind=selectPath.length;
						info.path=item[2];
						selectPath.push(info);
						
					}
				});
					
				//selectPath[i].info.totalTime
				//transPath[i].info.busTransitCount+transPath[i].info.subwayTransitCount	
				
				shortTimePath=selectPath;
				shortTransPath=selectPath;
			
				
				shortTimePath.sort(function(a,b){
					return a.path.info.totalTime > b.path.info.totalTime ? -1: a.path.info.totalTime < b.path.info.totalTime ? 1:0;
				});
				
				shortTransPath.sort(function(a,b){
					return a.path.info.busTransitCount+a.path.info.subwayTransitCout > b.path.info.busTransitCount+b.path.info.subwayTransitCout ? -1: a.path.info.busTransitCount+a.path.info.subwayTransitCout < b.path.info.busTransitCount+b.path.info.subwayTransitCout ? 1:0 ;
				})
				
				var score = new Array;
				
				for(var i=0;i<selectPath.length;i++)
				{
					score.push(0);
				}
				
				
				
				for(var i=0;i<selectPath.length;i++)
				{
					score[shortTimePath[i].ind]+=selectPath.length-i;
					score[shortTransPath[i].ind]+=selectPath.length-i;
				}
				
			
				var cutSizeFlag=0;
				
				for(var i=0;i<selectPath.length;i++)
				{
					
					if(cutSizeFlag > 9) break;
						
					for(var j=0;j<selectPath.length;j++)
					{
						if(score[j]==selectPath.length*2-i)
						{
							cutSizeFlag++;
							finalResultPath.push(selectPath[j].path);
							break;
						}
					}
				}
				
				//console.log(selectPath);
				console.log(finalResultPath);
				callback(null);
			}
		],
		function(err)
		{
			//console.log(resultPath);
			if(!err) callback(finalResultPath);
		}
	);
	
	//	console.log(result);
		
	
};