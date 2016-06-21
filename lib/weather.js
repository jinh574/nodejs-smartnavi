var jsParser = require('./general');
var weatherCode = {
	"200": "가벼운 비를 동반한 천둥구름",
	"201": "비를 동반한 천둥구름",
	"202": "폭우를 동반한 천둥구름",
	"210": "약한 천둥구름",
	"211": "천둥구름",
	"212": "강한 천둥구름",
	"221": "불규칙적 천둥구름",
	"230": "약한 연무를 동반한 천둥구름",
	"231": "연무를 동반한 천둥구름",
	"232": "강한 안개비를 동반한 천둥구름",
	"300": "가벼운 안개비",
	"301": "안개비",
	"302": "강한 안개비",
	"310": "가벼운 적은비",
	"311": "적은비",
	"312": "강한 적은비",
	"313": "소나기와 안개비",
	"314": "강한 소나기와 안개비",
	"321": "소나기",
	"500": "악한 비",
	"501": "중간 비",
	"502": "강한 비",
	"503": "매우 강한 비",
	"504": "극심한 비",
	"511": "우박",
	"520": "약한 소나기 비",
	"521": "소나기 비",
	"522": "강한 소나기 비",
	"531": "불규칙적 소나기 비",
	"600": "가벼운 눈",
	"601": "눈",
	"611": "진눈깨비",
	"612": "소나기 진눈깨비",
	"615": "약한 비와 눈",
	"616": "비와 눈",
	"620": "약한 소나기 눈",
	"621": "소나기 눈",
	"622": "강한 소나기 눈",
	"701": "박무",
	"711": "연기",
	"721": "연무",
	"731": "모래 먼지",
	"741": "안개",
	"751": "모래",
	"761": "먼지",
	"762": "화산재",
	"771": "돌풍",
	"781": "토네이도",
	"800": "구름 한 점 없는 맑은 하늘",
	"801": "약간의 구름이 낀 하늘",
	"802": "드문드문 구름이 낀 하늘",
	"803": "구름이 거의 없는 하늘",
	"804": "구름으로 뒤덮인 흐린 하늘",
	"900": "토네이도",
	"901": "태풍",
	"902": "허리케인",
	"903": "한랭",
	"904": "고온",
	"905": "바람부는",
	"906": "우박",
	"951": "바람이 거의 없는",
	"952": "약한 바람",
	"953": "부드러운 바람",
	"954": "중간 세기 바람",
	"955": "신선한 바람",
	"956": "센 바람",
	"957": "돌풍에 가까운 센 바람",
	"958": "돌풍",
	"959": "심각한 돌풍",
	"960": "폭풍",
	"961": "강한 폭풍",
	"962": "허리케인"
};

var jsWeather = function(date) {
	this.getCurrent = function(callback) {
		if(date.getTime() - Date.now() < 86400 * 1000) { //하루 이내일 때
			var parser = new jsParser("http://api.openweathermap.org/data/2.5/forecast?q=Seoul,kr&mode=json&units=metric&appid=6126a415f52407b890eabcd2c263d925");
				parser.getJson(function(data) {
					var doneFlag = 0;
					var result;
					data.list.forEach(function(item, index, arr) {
						var tmpDate = new Date(item.dt * 1000);
						if(tmpDate.getDate() == date.getDate() && tmpDate.getHours() == (parseInt(date.getHours()/3)+1)*3) {
							result = item;
							doneFlag = 1;
						}
						else if(date.getHours() > 21 && date.getDate() + 1 == tmpDate.getDate() && tmpDate.getHours() == 0) {
							result = item;
							doneFlag = 1;
						}
						
						if(index == arr.length -1 && doneFlag) {
							callback(makeJson(result));
						}
					});
			});	
		}
		else if(date.getTime() - Date.now() < 0) {
			callback({
				"status": 204,
				"description": "잘못된 참조, 과거시간 입력"
			});
		}
		else { //하루 이상일 때
			var parser = new jsParser("http://api.openweathermap.org/data/2.5/forecast/daily?q=Seoul&mode=json&units=metric&cnt=16&appid=6126a415f52407b890eabcd2c263d925");
			parser.getJson(function(data) {
				var doneFlag = 0;
				var result;
				data.list.forEach(function(item, index, arr) {
					var tmpDate = new Date(item.dt * 1000);
					if(tmpDate.getMonth() == date.getMonth() && tmpDate.getDate() == date.getDate()) {
						result = item;
						doneFlag = 1;
					}
					
					if(index == arr.length - 1 && doneFlag) {
						//callback(result);
						if(!result) {
							callback({
								"status": 204,
								"description": "데이터 없음(너무 먼 미래)"
							});
						}
						else {
							callback(makeJson(result));
						}
					}
				});
			});
		}
	}
	
	return this;
};

function makeJson(item) {
	var result;
	
	var description = weatherCode[item.weather[0].id];
	var isRain = item.weather[0].description.indexOf("rain") != -1 ? 1 : 0;
	var icon = "http://openweathermap.org/img/w/" + item.weather[0].icon + ".png";
	result = {
		"status": 200,
		"timestamp": item.dt,
		"description": description,
		"umbrella": isRain,
		"icon": icon
	}
	
	return result;
};

module.exports = jsWeather;