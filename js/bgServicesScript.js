var myService;
var mCurrentPosition;
var mCurrentPositionRetrievied;
document.addEventListener('deviceready', function() {
	watchCurrentPosition();
	var serviceName = 'com.red_folder.phonegap.plugin.backgroundservice.lights.LightsBgService';
	var factory = cordova.require('com.red_folder.phonegap.plugin.backgroundservice.BackgroundService');
	myService = factory.create(serviceName);
	//go();
	}, true);

function getStatus() {
	myService.getStatus(function(r){displayResult(r);}, function(e){displayError(e);});
	}

function displayResult(data) {
	alert("Is service running: " + data.ServiceRunning);
	}

function displayError(data) {
	alert("We have an error");
}
function updateHandler(data)
{
	if (data.LatestResult != null)
	{
		try
		{			
			//handleLightsFinalResponse(data.LatestResult.Message);
		}
		catch (err){}
   	}
	if(mCurrentPosition != null && isHomeFenceCreated)
	{
		var  autoGeoData = new getAutoGeoData(30, mCurrentPosition.coords.latitude, mCurrentPosition.coords.longitude);
		sendGeoLocation(autoGeoData);
	}
	
}

function go()
{
	if(myService != undefined)
		myService.getStatus(function(r){startService(r);}, function(e){displayError(e);});
};

function startService(data) {
	if (data.ServiceRunning) {
	      enableTimer(data);
	   }
	else
	{
		myService.startService(function(r){enableTimer(r);}, function(e){displayError(e);});
	}
}
	
function enableTimer(data) {
	if (data.TimerEnabled) {
	      registerForUpdates(data);
	   } 
	else {
	      myService.enableTimer(2000, function(r){registerForUpdates(r);}, function(e){displayError(e);});
	   }
}

function registerForUpdates(data) {
	if (!data.RegisteredForUpdates)
	{
		myService.registerForUpdates(function(r){updateHandler(r);}, function(e){handleError(e);});
	}
}

function handleLightsFinalResponse(lightFinalResponse)
{
	//lightFinalResponse = JSON.parse(lightFinalResponse);
	console.log("lightFinalResponse "+lightFinalResponse);
	console.log("lightFinalResponse.requestId "+lightFinalResponse.requestId);
	if(lightFinalResponse.requestId == "lightsKeyOn" && lightFinalResponse.requestStatus == "success")
	{
		$('#light_img_div img').attr({'src':'images/light_on.png', 'width':'200px', 'height':'250px'});
		$('#lights_current_Status').text("Your home is glowing now.");
		alert("The Lights in your home are in ON State");
	}
	else if(lightFinalResponse.requestId == "lightsKeyOff" && lightFinalResponse.requestStatus == "success")
	{
		$('#light_img_div img').attr({'src':'images/bulb.png', 'width':'200px', 'height':'250px'});
		$('#lights_current_Status').text("You are saving power now.");
		alert("The Lights in your home are in OFF State");
	}
	//myService.deregisterForUpdates(function(r){handleSuccess(r)}, function(e){handleError(e)})
	//myService.stopService(function(r){handleSuccess(r);}, function(e){handleError(e);});
}
function handleSuccess(data){
	//alert("Service has de register For Updates");
}

function handleError(data) {
	//alert("We have an error in stopping service");
}

function watchCurrentPosition()
{
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		
		alert("Geolocation is not supported by this browser.");
	}

	function showPosition(position) {
		mCurrentPosition = position;    
	}
}

function getAutoGeoData(radius, lat, lng)
{
	this.radius = radius;
	this.latitude = lat;
	this.longitude = lng;
}

function startBgService()
{
	go();
}
function stopBgService()
{
	if(myService != null)
		myService.stopService(function(r){handleSuccess(r);}, function(e){handleError(e);});
}