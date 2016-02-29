$(document).ready(function()
{
	alert("testttttttt");
	allevents();
	document.addEventListener("deviceready", onDeviceReady, true);
	// document.addEventListener('deviceready', function() {
			// alert("device ready	");
				// myService = cordova.plugins.myService;
				// getStatus();
  			// }, true);
	loadMap(1);
});
var isDeviceReady = false;
var myMedia;
var writeText;
var txtAlert;
function allevents()
{
	 // Retrieve
    var check = $('#updateStatus').text();//initial text in html is blank 
    if(check == "")
    {
    	 localStorage.setItem("bgServiceStatus", "notrunning");
    }
    txtAlert = localStorage.getItem("bgServiceStatus");
    if(txtAlert != null)
    {
    	if(txtAlert == "running")
    		{
    		$("#createGeofence_select").val('on').slider('refresh');
    		$('#currentStatus').text("Approximately 3 hours (88 KM) away from the destination.");
    		document.getElementById("viewmap_button").disabled = true;
			document.getElementById("offAlarm").disabled = false;
    		}
    	else
    		{
	    		$("#createGeofence_select").val('off').slider('refresh');
	    		$('#updateStatus').text("No details available. Please activate alarm.");
	    		$('#currentStatus').text("Alarm deactivated.");
	    		document.getElementById("viewmap_button").disabled = false;
				document.getElementById("offAlarm").disabled = true;
    		}
    }
    else
    {
    	$("#createGeofence_select").val('off').slider('refresh');
    	$('#updateStatus').text("No details available. Please activate alarm.");
		$('#currentStatus').text("Alarm deactivated.");
		document.getElementById("viewmap_button").disabled = false;
		document.getElementById("offAlarm").disabled = true;
    }
	$('#viewmap_button').unbind();
	$('#viewmap_button').bind('click',function(){
		$('#create_geofence_screen').hide();
		loadMap(globalRadius);
		$('#viewMap_screen').show();
		$('#back').hide();
	});
	
	$('#map_submit').unbind();
	$('#map_submit').bind('click',function(){
		clickedonMap(globalMarkerLocation,true);
		$('#create_geofence_screen').show();
		$('#viewMap_screen').hide();
		isEnteredAddress = false;
		saveMapData();		
	});
	$('#map_back').bind('click',function(){
		$('#create_geofence_screen').show();
		$('#viewMap_screen').hide();
		isEnteredAddress = false;
		restoreMapData();
	});
	$('#radius_map_new').keyup(function(){
		enteredRadiusVal();
	});
	
	    $('#offAlarm').unbind();
	    $('#offAlarm').bind('click',function(){
	    	offAlarm();
	    });
	 /*   $('#create').unbind();
	    $('#create').bind('click',function(){
	    	if(isDeviceReady)
	    		{
	    		//writeFile("Hello Again");
	    		}else{alert("Device not ready");}
	    });*/
	
	$(document).on('slidestop', '#createGeofence_select', function(){
		var togg = document.getElementById("createGeofence_select").value;
		if(togg=="on")
		{
			var val = $('#inputAddressBar').val();
			if(globalMarkerLocation == null || val == "" )
				{
				$("#createGeofence_select").val('off').slider('refresh');
					alert("Please select address");
				}
			else
				{
					if (typeof(Storage) != "undefined") {
					    // Store
					    localStorage.setItem("bgServiceStatus", "running");
					   
					} else {
						alert("Sorry, your browser does not support Web Storage...");
					}
					if(isDeviceReady)
						startBgService();
					document.getElementById("viewmap_button").disabled = true;
					document.getElementById("offAlarm").disabled = false;
				}
		}
		else if(togg == "off")
		{
			offAlarm();
			/*document.getElementById("viewmap_button").disabled = false;
			document.getElementById("offAlarm").disabled = true;
			//off function
			stopAudio();
			  localStorage.setItem("bgServiceStatus", "notrunning");
			$('#updateStatus').text("No details available. Please activate alarm.");
    		$('#currentStatus').text("Alarm deactivated.");
    		stopBgService();*/
		}
	});
}

function onDeviceReady() {
	alert("not ready");
	isDeviceReady = true;
	//writeFile("Hello");
     myMedia = new Media('sound.mp3', stopAudio);
	 //alert("device ready. Welcome");
	myService = cordova.plugins.myService;
	checkConnection();
	trackCurrentLocation();
}

function trackCurrentLocation()
{
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

function gotFS(fileSystem) {
        fileSystem.root.getFile("test.txt", {create: true}, gotFileEntry, fail);
    }

    function gotFileEntry(fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail);
    }

    function gotFileWriter(writer) {
        writer.onwrite = function(evt) {
            console.log("write success");
        };
        writer.write(writeText)
    }

    function fail(error) {
        if(error.code == 1){
            alert('not found');
        }
        alert(error.code);
    }

    function writeFile(msg)
    {
    	 window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    	writeText = msg;
    }
	
	function playAudio()
  {
    myMedia.play();
  }

  function stopAudio()
  {
    myMedia.stop();
  }
  
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
			//alert("latitude "+data.LatestResult.latitude);
			//alert("longitude "+data.LatestResult.longitude);
		}
		catch (err){}
   	}
	
	var dateObj = new Date();
	console.log("neha   "+dateObj);
	checkConnection();
	trackCurrentLocation();
	setTimeout(function(){
		calculateDistance();
		$('#currentStatus').text("Approximately 2.5 hours ("+globalDistance+" KM) away from the destination.");
	}, 500);
	//calculateDistance();
	$('#updateStatus').text(dateObj);
	
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
	      myService.enableTimer(20000, function(r){registerForUpdates(r);}, function(e){displayError(e);});
	   }
}

function registerForUpdates(data) {
	if (!data.RegisteredForUpdates)
	{
		myService.registerForUpdates(function(r){updateHandler(r);}, function(e){handleError(e);});
	}
}

function handleSuccess(data){
	//alert("Service has de register For Updates");
}

function handleError(data) {
	//alert("We have an error in stopping service");
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

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Currently using Unknown connection';
    states[Connection.ETHERNET] = 'Currently using Ethernet connection';
    states[Connection.WIFI]     = 'Currently using WiFi connection';
    states[Connection.CELL_2G]  = 'Currently using Cell 2G connection';
    states[Connection.CELL_3G]  = 'Currently using Cell 3G connection';
    states[Connection.CELL_4G]  = 'Currently using Cell 4G connection';
    states[Connection.CELL]     = 'Currently using Cell generic connection';
    states[Connection.NONE]     = 'No network connection from past 7 minutes';

    $('#networkStatus').text(states[networkState]);
     //   alert('Connection type: ' + states[networkState]);
}

