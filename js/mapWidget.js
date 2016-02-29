console.log("Loaded RADIUS WIDGET");
var startingRadiusVal = "1.00";
var globalRadius = startingRadiusVal;
var savedRadius=startingRadiusVal;
var prevDist=0;
var dir=1;
var z=0;
var circles = {};
var id;
var arr = new Array();
var uniqueNumber =1;
function clearAllMarkers()
{
	console.log("clearing marker");
	mark1.setMap(null);
	mark2.setMap(null);
	mark3.setMap(null);
}
DistanceWidget.prototype = new google.maps.MVCObject();
RadiusWidget.prototype = new google.maps.MVCObject();
function DistanceWidget(geofenceMap,location,radVal) {
 		google.maps.event.trigger(geofenceMap, 'resize');
		geofenceMap.setZoom(geofenceMap.getZoom());
 		globalMarkerPos = location;
 		point = location;
 		console.log("Location "+point);
         this.set('map', geofenceMap);
         this.set('position', location);
         geofenceMap.setCenter(location);
         // Create a new radius widget
         var radiusWidget = new RadiusWidget(radVal);
         // Bind the radiusWidget map to the DistanceWidget map
         radiusWidget.bindTo('map', this);
         // Bind the radiusWidget center to the DistanceWidget position
         radiusWidget.bindTo('center', this, 'position');
         // Bind to the radiusWidgets' distance property
         this.bindTo('distance', radiusWidget);
         // Bind to the radiusWidgets' bounds property
         this.bindTo('bounds', radiusWidget);
}

var delCircle = function (id) {
	z=z-1;
	id=arr[z];
	circle = circles[id];
	circle.setMap(null);
	z=z+1;
};

function RadiusWidget(startingRadiusVal) {
	uniqueNumber++;
	console.log("UNIQUE NUMBER: "+uniqueNumber);
	circle = new google.maps.Circle({
				id:uniqueNumber,
 				strokeColor:"#0000FF",
	 			strokeOpacity:0.4,
	 			strokeWeight:2,
	 			fillColor:"#0000FF",
	 			clickable: false,
	 			fillOpacity:0.05
	});
 			// Set the distance property value.
 			this.set('distance', startingRadiusVal);
	         // Bind the RadiusWidget bounds property to the circle bounds property.
	         this.bindTo('bounds', circle);
	         // Bind the circle center to the RadiusWidget center property
	         circle.bindTo('center', this);
	         // Bind the circle map to the RadiusWidget map
	         circle.bindTo('map', this);
	         // Bind the circle radius property to the RadiusWidget radius property
	         circle.bindTo('radius', this);
	         
	         z=z+1;
	  		id = circle.id;
	  		arr[z]  = id;
	  		circles[id] = circle;
	  		if(z!=1)
	  		delCircle(id);
	  		circle =  circles[id]  ;
	         
	         // Add the sizer marker
	         this.addSizer_();
}
       /**
        * Update the radius when the distance has changed.
        */
		RadiusWidget.prototype.distance_changed = function() {
    	   this.set('radius', this.get('distance') * 1000);
       	};
       RadiusWidget.prototype.addSizer_ = function() {
    	   image = {
			     url: 'img/arrowSizer.png',
			 	 size: new google.maps.Size(50, 50),
			 	 origin: new google.maps.Point(0,0),
			 	 anchor: new google.maps.Point(0, 5)
    	   	};
    	   leftArrowImg = {
 		     url: 'img/leftArrow.png',
 			 size: new google.maps.Size(50, 50),
 			 origin: new google.maps.Point(0,0),
 			 anchor: new google.maps.Point(0, 5)
 			 };
 			 rightArrowImg = {
 		     url: 'img/rightArrow.png',
 			 size: new google.maps.Size(50, 50),
 			 origin: new google.maps.Point(0,0),
 			 anchor: new google.maps.Point(0, 5)
 			 };
 		 	 downArrowImg = {
 		     url: 'img/downArrow.png',
 			 size: new google.maps.Size(50, 50),
 			 origin: new google.maps.Point(0,0),
 			 anchor: new google.maps.Point(0, 5)
 			 };
 			 upArrowImg = {
 			    url: 'img/upArrow.png',
 				size: new google.maps.Size(50, 50),
 				origin: new google.maps.Point(0,0),
 				anchor: new google.maps.Point(0, 5)
 			 };
    	   sizer = new google.maps.Marker({
            draggable: true,
            icon:image,
            title: 'Drag me!'
         });
    	   mark1 = new google.maps.Marker({
   			});
    	   mark2 = new google.maps.Marker({
   			});
    	   mark3 = new google.maps.Marker({
   			});
         sizer.bindTo('map', this);
         sizer.bindTo('position', this, 'sizer_position');
         var me = this;
         google.maps.event.addListener(sizer, 'drag', function() {
           me.setDistance();
         });
       };

       RadiusWidget.prototype.center_changed = function() {
         bounds = this.get('bounds');
         Mthis = this;
         // Bounds might not always be set so check that it exists first.
         if (bounds) {
           var lng = bounds.getNorthEast().lng();
           // Put the sizer at center, right on the circle.
           var position = new google.maps.LatLng(this.get('center').lat(), lng);
           this.set('sizer_position', position);
         }
       };

      RadiusWidget.prototype.distanceBetweenPoints_ = function(p1, p2) {
         if (!p1 || !p2) {
           return 0;
         }
         mark1.setMap(geofenceMap);
         mark2.setMap(geofenceMap);
         mark3.setMap(geofenceMap);
         var R = 6371; // Radius of the Earth in km
         var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
         var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
         var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
           Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
           Math.sin(dLon / 2) * Math.sin(dLon / 2);
         var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
         var d = R * c;
         globalRadius = d.toFixed(2);
         applyArrows(prevDist,d);
         setTimeout(function(){
     		prevDist = d;
     	},70);
         if(globalRadius > 100)
        {
        	 globalRadius = 100;
        }
         return globalRadius;
       };

       Number.prototype.toRad = function() {
    	         return this * Math.PI / 180;
    	      };

       Number.prototype.toDeg = function() {
    	         return this * 180 / Math.PI;
    	      };
   	 function destinationPoint(brng, distG) {
    	        distG = distG / 6371;
    	        brng = brng.toRad();
    	        var lat1G = point.lat().toRad(), lon1G = point.lng().toRad();
    	        var lat2G = Math.asin(Math.sin(lat1G) * Math.cos(distG) +
    	                               Math.cos(lat1G) * Math.sin(distG) * Math.cos(brng));
    	          var lon2G = lon1G + Math.atan2(Math.sin(brng) * Math.sin(distG) *
    	                                       Math.cos(lat1G),
    	                                       Math.cos(distG) - Math.sin(lat1G) *
    	                                       Math.sin(lat2G));
    	          if (isNaN(lat2G) || isNaN(lon2G)) return null;
    	          return new google.maps.LatLng(lat2G.toDeg(), lon2G.toDeg());
    	       };

    	function applyArrows(prv,cur)
    	{
    		if(prv<cur) //increasing
    		{
    			dir = 1;
    		}
    		else //decreasing
    		{
    	 		dir=0;
    	 	}
   		}
       /**
        * Set the distance of the circle based on the position of the sizer.
        */
       RadiusWidget.prototype.setDistance = function() {
	     // As the sizer is being dragged, its position changes.  Because the RadiusWidget's sizer_position is bound to the sizer's position, it will change as well.
         var pos = this.get('sizer_position');
         var center = this.get('center');
         var distance = this.distanceBetweenPoints_(center, pos);
         var pos1  = destinationPoint(0,distance);
         this.set('sizer_position1', pos1);
         if(dir==1)
       	 {
       		mark1.setIcon(upArrowImg);
         }
       	else
       	{
       		mark1.setIcon(downArrowImg);
       	}
       	 mark1.bindTo('position', this, 'sizer_position1');
   		  var pos2  = destinationPoint(180,distance);
          this.set('sizer_position2', pos2);
    	  if(dir==1)
       		 mark2.setIcon(downArrowImg);
       	  else
       		mark2.setIcon(upArrowImg);

       	  mark2.bindTo('position', this, 'sizer_position2');
       	  var pos3  = destinationPoint(270,distance);
          this.set('sizer_position3', pos3);
    	  if(dir==1)
       			mark3.setIcon(leftArrowImg);
       	  else
       	  {
       		mark3.setIcon(rightArrowImg);
       	  }
       	  mark3.bindTo('position', this, 'sizer_position3');
         // Set the distance property for any objects that are bound to it
         this.set('distance', distance);
       };