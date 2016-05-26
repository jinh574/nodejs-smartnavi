var xml2js = require('xml2js');
var http = require('http');
var testing = require('../lib/general');
var filter = require('../lib/filter');
exports.test=function asd(name)
{
	console.log(name);
};

exports.searchddRoute=function searchddRoute(parser_txt)
{
	return parser_txt.result.path;
};


exports.normalPath = function normalPath(start_x,start_y,des_x,des_y)
{
	var rtn = filter.normalFilter(start_x,start_y,des_x,des_y);
	var result=new Array();

	for(var i=0;i<rtn.length;i++)
	{
//		for(var j=1;j<rtn[i].subPath.length;j++)
//		{
//			result.push ( rtn[i].subPath[j].passStopList);
//		}
		result.push(rtn[i].subPath);
	}
	return result;
};

exports.filterPath = function filterPath(start_x,start_y,des_x,des_y,year,month,hour)
{
	var rtn = filter.rideFilter(start_x,start_y,des_x,des_y,year,month,hour);
	var result=new Array();
	
	for(var i=0;i<rtn.length;i++)
	{
//		for(var j=1;j<rtn[i].subPath.length;j++)
//		{
//			result.push ( rtn[i].subPath[j].passStopList);
//		}
		result.push(rtn[i].subPath);
	}
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

exports.searchRoute=function searchRoute(srcLat,srcLng,dstLat,dstLng)
{
	//var parser = new testing ("http://dev.odsay.com/Denny_test/appleTree/v1/0/Path/PathSearch_Exit.asp?Echo=yes&Output=json&SX="+srcLng+"&SY="+srcLat+"&EX="+dstLng+"&EY="+dstLat+"&OPT=0&svcID=56f14f5c5ed77cdf26fec5f852c54abe");
	
	console.log(srcLng);//x
	console.log(srcLat);//y
	console.log("http://dev.odsay.com/Denny_test/appleTree/v1/0/POI/PointSearch.asp?Echo=yes&Output=json&x="+srcLng+"&y="+srcLat+"&radius=250&svcID=56f14f5c5ed77cdf26fec5f852c54abe");
	var parser = new testing ("http://http://dev.odsay.com/denny_test/appletree/v1/0/POI/PointSearch.asp?x=126.933361407195&y=37.3643392278118&radius=100&svcID=56f14f5c5ed77cdf26fec5f852c54abe");
	var nearStation= parser.getJson();
	console.log("count:"+nearStation.result.count);
	
	var stationCount=nearStation.result.count; 
	var fastStatIdx=0;
	var distance=new Array();
	for(var i=0; i< stationCount;i++)//거리 구하
	{
		var x=nearStation.result.station[i].x;
		var y=nearStation.result.station[i].y;
		var gap_x = srcLng-x;
		var gap_y = srcLat-y;
		gap_x = gap_x*92;
		gap_y = gap_y*114;
		//Math.sqrt(2);
		distance[i] = Math.sqrt(gap_x*gap_x+gap_y*gap_y);
	}
	
	var nearIdx=0;
	
	for(var i=0;i<stationCount;i++)
		if(distance[nearIdx]<distance[i]) nearIdx=i;
	
	console.log("nearStation="+nearIdx);
	
	var parser_2;
	var pathArry=new Arry();
	
	for(var i=0;i<stationCount;i++)
	{
		console.log("sg   x="+nearStation.result.station[i].x+" y="+nearStation.result.station[i].y );
		praser_2=new testing("http://dev.odsay.com/Denny_test/appleTree/v1/0/Path/PathSearch_Exit.asp?Echo=yes&Output=json&SX="+nearStation.result.station[i].x+"&SY="+nearStation.result.station[i].y+"&EX="+dstLng+"&EY="+dstLat+"&OPT=0&svcID=56f14f5c5ed77cdf26fec5f852c54abe");
		var getFastTime=parser_2.getJson();
		var fastRoute=0;
		for(var j=0;j<getFastTime.result.path.length;j++)
		{
			if(getFastTime.result.path[j].totalTime < get.FastTime.result.path[fastRoute].totalTime)
			{
				fastRoute=j;
			}
		}
		pathArry[pathArry.length]=getFastTime.result.path[fastRoute];
	}
	
	console.log(pathArry[0]);
	console.log("end");
	
	return null;
};