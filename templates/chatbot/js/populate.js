var idPopulate = 'for-populate';
var idTitle = 'title-ludo';
var api_token = 'AIzaSyCF_IWxe2IsNZZ3rh-gEVr4bJ1gIak0vF0';
var user_dict = {};

window.onload = function() {initial();};

function initial() {
	//display website welcome sign
	var str1 = '<a href="index.html">WELCOME TO LuDO</a>'
	var nexttime = changeOpacityById(idTitle, str1, 0);
	//display subtitle
	var nT = '<h2>LuDO is a chatbot that will recommend you activities for you to enjoy!</h2></br><h2 onclick="showInput()">Click here to begin&nbsp;&nbsp;&nbsp;&nbsp;<i class="fa fa-arrow-circle-down"></i></h2>';
	changeOpacityById(idPopulate, nT, nexttime + 1000);
}

function showInput(){
	//Called from initial. display input bar for user name entry
	var nT = '<div class="form-group"><input autofocus type="text" class="form-control" id="name" placeholder = "Hi! What\'s your name?" autocomplete="off" onkeydown="if (event.keyCode == 13) { takeName(); return false; }"><h2 id="pressenter" onclick="takeName()">ENTER</h2></div>';
	changeOpacityById(idPopulate, nT, 0);
}

function takeName() {
	//Called from name entry. get name username from id name; put it in user_dict
	var nameInput = document.getElementById('name');
	var userName = nameInput.value;
	user_dict.name = userName;
	changeOpacityById(idPopulate, "", 0);
	start();
}

function start() {
	//Called after username determined.start conversation with user_dict.name
	var str1 = '<h2>Well hey there,  ' + user_dict.name + '! Nice to meet you.</h2>';
	var nexttime = changeOpacityById(idPopulate, str1, 0);
	var str2 = '<h2>My name\'s LuDO, and I\'m here for you if you\'re bored and want something to do...</h2></br>';
	var strbtn = '<h2 id="im-game" onclick=askInitialLocationQuery()>' + '<i class="fa fa-arrow-circle-right"></i>&nbsp;&nbsp;&nbsp;&nbsp;' + "I'M GAME" +'&nbsp;&nbsp;&nbsp;&nbsp;</h2>';
	changeOpacityById(idPopulate, str2 + strbtn, nexttime + 1000);
}

function askInitialLocationQuery() {
	//Called on I'm Game click.User wants to play. determine user's desired 
	//activity location.
	var userQuery = '<h2>Ok, ' + user_dict.name + ', what location do you';
	userQuery += ' want to explore for activities?</h2></br>';
	var nT = '<div class="form-group"><input autofocus="autofocus" type="text"';
	nT += ' class="form-control" id="location" placeholder = "Enter Location"';
	nT += ' autocomplete="off" onkeydown="if (event.keyCode == 13) { takeLocation();';
	nT += ' return false; }"><h2 id="locationenter" onclick="takeLocation()">ENTER</h2></div>';
	var nexttime = changeOpacityById(idPopulate, userQuery + nT, 0);

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
			//changeOpacityById(idPopulate, user_dict.lng, 0);
			askInitialTimeQuery();
		}
	}
	xmlHttp.open('GET', url, true);
	xmlHttp.send(null);
}

function askInitialTimeQuery() {
	//called from AskInitialLocationQuery() as it is the next round of initial
	//questioning. Now the user is asked what time frame he is looking for.
	var answer1 = '<h2>' + user_dict.address + ' sounds great!</h2></br>'
	answer1 += ' What time frame were you thinking?';
	answer1 += ' Pick one of the following options:';
	var svgHtml = '<svg width="800" height="600" id="init-svg"></svg>';
	document.getElementById(idPopulate).innerHTML = answer1 + svgHtml;
	bubbleCSV('#init-svg','csv/init.csv');
}

function queryDecisionTree(){
	alert("yo");
}

function choices() {
	choiceList = bogusChoices();
	var labels = choiceList[0]
	probs = choiceList[1]
	alert(labels);
}

function bogusChoices() {
	var arr1 = ['Steel', 'Coal', 'Mining', 'Education', 'Medical', 'Law']
	var arr2 = [1 , 2, 3, 1, 2, 4]
	var sum2 = arr2.reduce(function(a,b) { return a+ b;}, 0);
	for(var i=0; i<arr2.length; i++) { arr2[i] /= sum2;};
	return [arr1, arr2];
}