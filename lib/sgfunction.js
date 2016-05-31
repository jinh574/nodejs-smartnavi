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
		  var dis= parser.getJson()
		  shortTime.push(dis.result.path[0]);
	}
	console.log(shortTime[0].info);
	return dis;
};