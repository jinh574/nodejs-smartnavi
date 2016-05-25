var xml2js = require('xml2js');
var http = require('http');

exports.test=function asd(name)
{
	console.log(name);
};

exports.searchRoute=function searchRoute(parser_txt)
{

	var arr_x = new Array();
	var arr_y = new Array();
	var index = 0;
	//parser_txt.result.path[0].subPath[1].passStopList.stations[0].x
	for(var i=0;i<parser_txt.result.path.length;i++)
	{
		console.log("k="+k);
		for(var j=0;j<parser_txt.result.path[i].subPath.length;j++)
		{
			console.log("j="+j);
			if(j!=0 && j%2>0)
			{
				for(var k=0;k<parser_txt.result.path[i].subPath[j].passStopList.stations.length;k++)
				{
					arr_x[index]=parser_txt.result.path[i].subPath[j].passStopList.stations[k].x;
					arr_y[index]=parser_txt.result.path[i].subPath[j].passStopList.stations[k].y;
					index++;
				}
				console.log("-----------------");
			}
		}
	}
};

exports.getMap=function getMap(parser_txt)
{
	console.log(parser_txt);
};