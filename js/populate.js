var idQuestion = 'for-question';
var idTitle = 'title-ludo';
var idInput = 'for-input';
var api_token = 'AIzaSyCF_IWxe2IsNZZ3rh-gEVr4bJ1gIak0vF0';
var user_dict = {};
var i = -1;
var arrChoices = ["How do you want to spend your time?", "Awesome. More specifically, which of the following are you interested in?", "Here are my recommendations! You can click on them to explore:"];
var csvFiles = ['csv/spend.csv', 'csv/specific.csv', 'csv/final.csv'];
// var svg_ids = ['#spend-svg', '#spec-svg'];
window.onload = function() {initial();};

function initial() {
	//display website welcome sign
	var str1 = '<a href="index.html">WELCOME TO LuDO!</a>'
	var nextTime = changeOpacityById(idTitle, str1, 0);
	//display subtitle
	var userQuery = '<h2>LuDO is a chatbot that will recommend you activities for you to enjoy!</h2></br>';
	changeOpacityById(idQuestion, userQuery, nextTime + 500);
	var beginClick = '<h2 onclick="showInput()">Click here to begin&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right"></i></h2>';
	changeOpacityById(idInput, beginClick, nextTime + 500);
}

function showInput(){
	//Called from initial. display input bar for user name entry
	var userQuery = '<h2> Hiya! What\'s your name?</h2></br>';
	changeOpacityById(idQuestion, userQuery, 0);
	var nameEnter = '<div class="form-group"><input autofocus type="text" class="form-control" id="name" placeholder = "Press Enter When Done" autocomplete="off" onkeydown="if (event.keyCode == 13) { start(); return false; }"><h2 id="pressenter" onclick="start()">ENTER</h2></div>';
	changeOpacityById(idInput, nameEnter, 0);
}


function start() {
	//Called from name entry. get name username from id name; put it in user_dict
	var nameInput = document.getElementById('name');
	var userName = nameInput.value;
	user_dict.name = userName;
	changeOpacityById(idInput, "", 0);
	//Called after username determined.start conversation with user_dict.name
	var userQuery = '<h2>Well hey there,  ' + user_dict.name + '! Nice to meet you.</h2>';
	var nextTime = changeOpacityById(idQuestion, userQuery, 0);
	userQuery = '<h2>My name\'s LuDO, and I\'m here for you if you\'re bored and want something to do...</h2></br>';
	changeOpacityById(idQuestion, userQuery, nextTime + 1000);
	var strBtn = '<h2 onclick=askInitialLocationQuery()>' + "I'M GAME" +'&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-right"></i></h2>';
	changeOpacityById(idInput, strBtn, nextTime + 1000);
}

function askInitialLocationQuery() {
	//Called on I'm Game click.User wants to play. determine user's desired 
	//activity location.
	var userQuery = '<h2>Ok, ' + user_dict.name + ', what location do you';
	userQuery += ' want to explore for activities?</h2></br>';
	changeOpacityById(idQuestion, userQuery, 0);
	var locEnter = '<div class="form-group"><input autofocus="autofocus" type="text"';
	locEnter += ' class="form-control" id="location" placeholder = "Enter Location"';
	locEnter += ' autocomplete="off" onkeydown="if (event.keyCode == 13) { takeLocation();';
	locEnter += ' return false; }"><h2 id="locationenter" onclick="takeLocation()">ENTER</h2></div>';
	changeOpacityById(idInput,  locEnter, 0);
}

function takeLocation() {
	//Called on location enter. collect input from location text input and 
	//use Google Maps API to reverse geocode the input. This gives us a 
	//latitude and longitude if valid.
	var locationInput = document.getElementById('location');
	var location = locationInput.value;
	var location_str = location.split(" ").join("+")
	var url = 'https://maps.googleapis.com/maps/api/geocode/json?address='
	url += location_str + '&key=' + api_token;
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			var json_dct = eval("(" + xmlHttp.responseText + ")");
			var results = json_dct.results[0];
			user_dict.address = results.formatted_address;
			user_dict.lat = results.geometry.location.lat;
			user_dict.lng = results.geometry.location.lng;
			var load1 = '<div id="loading" ><h2><i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw">'
			load1 += '</i></h2></br><span class="sr-only">Loading...</span></div>';
			document.getElementById(idInput).innerHTML = load1;
			askInitialTimeQuery();
		}
	}
	xmlHttp.open('GET', url, true);
	xmlHttp.send(null);
}

function askInitialTimeQuery() {
	//called from AskInitialLocationQuery() as it is the next round of initial
	//questioning. Now the user is asked what time frame he is looking for.
	var answer1 = '<h2>' + user_dict.address + ' sounds great! What time frame were you thinking?</h2>';
	answer1 += '<h2>Select one or more of the following:</h2>';
	var nextTime = changeOpacityById(idQuestion, answer1, 0);
	var svgHtml = '<svg width="700" height="500" id="init-svg"></svg></br>';
	var submit = '<h2 id="submit-bubbles" onclick= resetCanvasAndRecommend()>Submit</h2>';
	setTimeout(function(){
		document.getElementById(idInput).innerHTML =  submit + svgHtml;
		bubbleCSV('#init-svg','csv/init.csv');
	}, nextTime + 500);
}

function resetCanvasAndRecommend() {
	//var nextTime = changeOpacityById(idQuestion, "", 0);
	var load1 = '<div id="loading" ><h2><i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw">'
	load1 += '</i></h2></br><span class="sr-only">Loading...</span></div>';
	document.getElementById(idInput).innerHTML = load1;
	document.getElementById(idQuestion).innerHTML = "";
	i = i + 1;
	if (i >= arrChoices.length) {
		return;
	}
	var choice = arrChoices[i];
	var csv_file = csvFiles[i];
	console.log(csv_file)
	var answer1 = '<h2>' + choice + '</h2>'
	var nextTime = changeOpacityById(idQuestion, answer1, 0);
	var svgHtml = '<svg width="700" height="500" id="init-svg"></svg></br>';
	var submit = '<h2 id="submit-bubbles" onclick= resetCanvasAndRecommend()>Submit</h2>';
	setTimeout(function(){
		document.getElementById(idInput).innerHTML =  submit + svgHtml;
		bubbleCSV('#init-svg',csv_file);
	}, nextTime + 500);
}