
var geofenceMap = null;
var distanceWidget;
var executeOnce;
var homeLat =13.0502745;
var homeLng =77.6232895;
var homeLocation = new google.maps.LatLng(homeLat, homeLng);
var geofenceMap = null;
var autocomplete;
var globalMarkerLocation;
var submittedRadius;
var submittedLocation;
var isSubmitted = false;
var randomNumber=1;
var y=0;
var markers = {};
var markerId;
var markerArray = new Array();
var marker;
var isEnteredAddress = false;
var globalCurrentLat;
var globalCurrentLng;
var globalDistance = 1;
var CurrentLat, CurrentLng;

function getCurrentLocation()
{
	  if (navigator.geolocation)
	    {
		  navigator.geolocation.getCurrentPosition(showPosition,showError);
	    }
	  else{
		  alert("Geolocation is not supported by this browser.");
	  }

function showPosition(position)
{
	//alert("lat and lng: "+position.coords.latitude+" "+position.coords.longitude);
	CurrentLat = position.coords.latitude;
	CurrentLng = position.coords.longitude;
	//globalMarkerLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	 // return globalMarkerLocation;
	//alert("initial loc:: "+initialLocation);
	  }
	function showError(error)
	  {
alert("Error in fetching current location");
	  switch(error.code)
	    {
	    case error.PERMISSION_DENIED:
	    alert("User denied the request for Geolocation.");
	    break;
	    case error.POSITION_UNAVAILABLE:
	    alert("Location information is unavailable.");
	    break;
	    case error.TIMEOUT:
	    alert("The request to get user location timed out.");
	    break;
	    case error.UNKNOWN_ERROR:
	    alert("An unknown error occurred.");
	    break;
	    }
		CurrentLat = homeLat;
		CurrentLng = homeLng;
	//  globalMarkerLocation = new google.maps.LatLng(homeLat, homeLng);
	//  return globalMarkerLocation;
	//alert("initial loc defined:: "+initialLocation);
	  }	
}

function loadMap(radVal)
{
//	trackCurrentLocation();
	alert("mapppppppppp");
var test = $( window ).height();
test = test -110;
$("#map-canvas").css("height",test);
	$('#radius_map_new').val(radVal);
	console.log("loading map");
	console.log("jump , geofenceMap ="+geofenceMap);
	if(geofenceMap == null)
	{
		var mapDiv = document.getElementById('map-canvas');
		geofenceMap = new google.maps.Map(mapDiv, {
			zoom:13,
			panControl:false,
			zoomControl:false,
			mapTypeControl:true,
			scaleControl:false,
			streetViewControl:false,
			overviewMapControl:false,
			rotateControl:false,
			mapTypeId: 'roadmap'
		});
	    google.maps.event.addListener(geofenceMap, "idle", function()
	    {
		  google.maps.event.trigger(geofenceMap, 'resize');
		  geofenceMap.setZoom(geofenceMap.getZoom());
	    });
	}
	getCurrentLocation();
	var Location = new google.maps.LatLng(CurrentLat, CurrentLng);
	var CurrenLocMarker = new google.maps.Marker({
	  	position: Location,
        draggable: false,
        title: 'Current location',
        icon:'images/curloc4.png'
     });
	CurrenLocMarker.setMap(geofenceMap);
	geofenceMap.setCenter(Location);
	console.log('current loca marker :'+Location);
	console.log("loc "+Location);
	globalMarkerLocation  = Location;
	if(isEnteredAddress)
	{
		refreshMap(globalMarkerLocation,radVal);
	}
	else
	{
		if(globalMarkerLocation == null)
			{
				refreshMap(homeLocation,radVal);
				clickedonMap(homeLocation);
			}
		else
			{
				refreshMap(globalMarkerLocation,radVal);
				clickedonMap(globalMarkerLocation);
			}
	}
	
	google.maps.event.addListener(geofenceMap, 'click', function(event) {
		/*distanceWidget = new DistanceWidget(simulateScreenMap,event.latLng);
		displayAddress(distanceWidget);*/
		clickedonMap(event.latLng);
		refreshMap(event.latLng,globalRadius);
	});
}
function handleMapEvents(loc,radVal)
{
	distanceWidget = new DistanceWidget(geofenceMap,loc,radVal);
	google.maps.event.addListener(distanceWidget, 'distance_changed', function() {
		 $('#radius_map_new').val(globalRadius);
		 executeOnce = true;
	     google.maps.event.addListener(sizer,'dragend',function(event) {
	    	 console.log("end drag");
	    	 if(executeOnce)
	    		 {
	    		 executeOnce = false;
	    		 console.log("ended drag: exec once");
	    		 clearAllMarkers();
	    		 handleMapEvents(loc,globalRadius);
	    		 }
	    	 
	     });
	});
}
function enteredRadiusVal()
{
	var checkRad = document.getElementById('radius_map_new').value;
	var numbers = /^[0-9]+$/;  
	if(checkRad > 100 || (checkRad.match(numbers) ==  false))
		{ 
		//error or invalid
		document.getElementById('radius_map_new').blur();
		document.getElementById('radius_map_new').value="";
		//alert("Radius should be in between 1 and 10");
		}
	else
		{
			globalRadius = checkRad;
			refreshMap(globalMarkerLocation ,globalRadius);
		}	
}

function initialize() {
	  // Create the autocomplete object, restricting the search to geographical location types.         
	  autocomplete = new google.maps.places.Autocomplete(
	      /** @type {HTMLInputElement} */(document.getElementById('inputAddressBar')),
	      { types: [] });
	  // When the user selects an address from the dropdown,populate the address fields in the form.
	  google.maps.event.addListener(autocomplete, 'place_changed', function() {
		  isEnteredAddress = true;
		  fillInAddress(autocomplete.getPlace());
	  });
	}

function fillInAddress(temp_place) {
  // Get the place details from the autocomplete object.
	globalAddressObject = temp_place;
  console.log("Selected Address from drop down menu is :"+temp_place.formatted_address);
  // stops execution if address is not selected from the drop down menu
  globalMarkerLocation = temp_place.geometry.location;
  refreshMap(globalMarkerLocation,globalRadius);
 }

function refreshMap(markerLocation,radVal)
{
	randomNumber++;
	marker=new google.maps.Marker({
		  position:markerLocation,
		  markerId:randomNumber,
		  //animation:google.maps.Animation.DROP
		  });
	marker.setMap(geofenceMap);
	geofenceMap.setCenter(markerLocation);
	 google.maps.event.addListener(geofenceMap, "idle", function()
			    {
				  google.maps.event.trigger(geofenceMap, 'resize');
				  geofenceMap.setZoom(geofenceMap.getZoom());
				//	geofenceMap.setCenter(markerLocation);
			    });

	handleMarker();
	handleMapEvents(markerLocation,radVal);
}

function handleMarker()
{
	y=y+1;
	markerId = marker.markerId;
	markerArray[y]  = markerId;
	markers[markerId] = marker;
	if(y!=1)
	delMarker(markerId);
	marker =  markers[markerId]  ;
}

var delMarker = function (markerId) {
	y=y-1;
	markerId=markerArray[y];
	marker = markers[markerId];
	marker.setMap(null);
	y=y+1;
};

function clickedonMap(clickedLocation,updateAddrss)
{
	var geocoderAlert = true;
	var geocoder = new google.maps.Geocoder();
	var clickedAddress;
	globalMarkerLocation = clickedLocation;
	geocoder.geocode({'latLng': clickedLocation}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK)
	    {
		    if (results[1])
		    {
				geofenceMap.setCenter(clickedLocation);
				clickedAddress = results[0].formatted_address;
				console.log("CLICKED ADDRESS :"+results[0].formatted_address);
//				fillInAddress(results[1]);
				if(updateAddrss)
				{
				$('#inputAddressBar').val('');
				$('#inputAddressBar').val(clickedAddress);
				}
		    }
		    else
		    {
		        alert('No results found');
		    }
	    }
	    else
	    {
	    	if(status == "ERROR")
	    	{
	    		if(geocoderAlert)
	    		{
	    				alert("Geocoder failed due to: ERROR. Problem with internet connectivity");
	    				geocoderAlert = false;
	    		}
	    	}
	    }
	});	
}

function saveMapData()
{
	isSubmitted = true;
	submittedRadius = globalRadius;
	submittedLocation = globalMarkerLocation;
	var radius_Unit = 'Km';	
	$('#rad_unit').text(radius_Unit);
	$('#geofence_radius').text(globalRadius);
}

function restoreMapData()
{
	if(isSubmitted)
		{
			globalRadius = submittedRadius;
			globalMarkerLocation = submittedLocation;
		}
	else
		{
			globalRadius = startingRadiusVal;
			globalMarkerLocation = homeLocation;
		}
}

var onSuccess = function(position) {
    console.log('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
    
    globalCurrentLat = position.coords.latitude;
    globalCurrentLng = position.coords.longitude;
    console.log("current loc details: Lat "+ globalCurrentLat + "Lng : "+globalCurrentLng);
};

// onError Callback receives a PositionError object
//
function onError(error) {
	console.log('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

function calculateDistance()
{
	if(globalMarkerLocation != null)
	{
		var markerLat = globalMarkerLocation.lat();
		var markerLng = globalMarkerLocation.lng();
		var distance = getDistanceFromLatLonInKm(globalCurrentLat,globalCurrentLng,markerLat,markerLng);
		globalDistance = distance.toFixed(2);
		var radius = $('#geofence_radius').text();
		if(radius > distance)
		{
			onAlarm();		
		}
	}
	else
	{
		console.log("Please select Location.");
	}
}

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
	  var R = 6371; // Radius of the earth in km
	  var dLat = deg2rad(lat2-lat1);  // deg2rad below
	  var dLon = deg2rad(lon2-lon1); 
	  var a = 
	    Math.sin(dLat/2) * Math.sin(dLat/2) +
	    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
	    Math.sin(dLon/2) * Math.sin(dLon/2)
	    ; 
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	  var d = R * c; // Distance in km
	  return d;
}
function deg2rad(deg) {
		var ret = deg * (Math.PI/180);
	  return ret;
}

function onAlarm()
{
	 if(isDeviceReady)
	 {
	 playAudio();
	 navigator.notification.vibrate(500);
	 setTimeout(function(){
		 navigator.notification.vibrate(500);
	 }, 1000);
	 }else{alert("Device not ready");}
	 
}

function offAlarm()
{
	
	document.getElementById("viewmap_button").disabled = false;
	document.getElementById("offAlarm").disabled = true;
	localStorage.setItem("bgServiceStatus", "notrunning");
	if(isDeviceReady)
	{
		stopAudio();
		stopBgService();
	}
	$("#createGeofence_select").val('off').slider('refresh');
	$('#updateStatus').text("No details available. Please activate alarm.");
	$('#currentStatus').text("Alarm deactivated.");
}