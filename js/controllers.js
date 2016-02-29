var myApp = angular.module('starter.controllers', [])

myApp.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
    console.log("test+modal");
  });

 

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
    console.log("closing login");
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

myApp.controller('savedDestinationsCtrl', function($scope) {
  $scope.savedDestinationList = [
    { title: 'Saved Destination 1', id: 1 },
    { title: 'Saved Destination 2', id: 5 },
    { title: 'Saved Destination 3', id: 6 }
  ];
  //alert("gett");
})

myApp.controller('savedDestinationCtrl', function($scope, $stateParams) {
//alert("tst");
});

myApp.controller('exitCtrl', function($scope, $stateParams) {

   $scope.exitApp = function() {
      //alert("Exiting");
   navigator.app.exitApp(); 
  };
});

myApp.controller('homeCtrl', function($scope, $stateParams,$ionicModal) {
console.log("tstHOme");
 // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/mapPage.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
    console.log("testmap+modal");
  });


 preReqsForMap();
 //alert("toggle status "+$scope.togleAlarm);
  $scope.pushNotificationChange = function() {
    console.log("Toggle:  "+$scope.pushNotification.checked);
    toggleChange($scope.pushNotification.checked);
  //  if($scope.pushNotification.checked)
  //  {
  //   alert("true");
  //   setTimeout(function(){
  // $scope.pushNotification = true;
  //   },1000);
  
  //  }
  //  else
  //  {
  //     alert("false");
  //       setTimeout(function(){
  // $scope.pushNotification = true;
  //   },1000);
  //  }
  };
 
 $scope.showMap = function() {
    $scope.modal.show();
    loadMap(1);
  };
 $scope.closeMap = function() {
    $scope.modal.hide();
  };
 $scope.initialize = function() {
    initialize();
  };
});

/*myApp.controller('mapPageCtrl',function($scope, $stateParams){
  console.log("mapp page");
    $scope.radiusKeyup = function(){
      console.log("Entered radius_map_new");
      enteredRadiusVal();
    }
$scope.sliderChange = function(){
  console.log("Entered slider");
 // enteredRadiusVal();
  }
});
*/
//-------------------


myApp.controller('mapCtrl',function($scope, $stateParams,  $ionicPopup){
  console.log("loaded map ctrl");

 $scope.radiusKeyup = function() {
  //alert("testsdsdtt");
  enteredRadiusVal();
}
$scope.setLevelText = function(rangeValue) {
  //  console.log('range value has changed to :'+$scope.levelvalue);
    //$scope.data.testvariable = $scope.data.levelvalue;
    radiusRangeChanged($scope.levelvalue);
  }

$scope.saveMapData = function() {
  //alert("testsdsdtt");
 saveMapRelatedData();
    $scope.modal.hide();
}

});










//-------------------
   myApp.controller('mapPageCtrl', function($scope, $ionicLoading) {
      function initialize() {
        var homeLat =13.0502745;
var homeLng =77.6232895;
var homeLocation = new google.maps.LatLng(homeLat, homeLng);
         console.log("initializeINGGGG");
        var mapOptions = {  
          center: new google.maps.LatLng(43.07493,-89.381388),
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        // Stop the side bar from dragging when mousedown/tapdown on the map
        google.maps.event.addListener(map, 'click', function(e) {
        alert("clicked "+e.latLng);
        });

        $scope.map = map;
      }
      google.maps.event.addDomListener(window, 'load', initialize);
      
      $scope.centerOnMe = function() {
        initialize();

       console.log("center on me clicked");
        if(!$scope.map) {
          console.log("error in map");
          return;
        }

        // $scope.loading = $ionicLoading.show({
        //   content: 'Getting current location...',
        //   showBackdrop: false
        // });
console.log("Getting msg");
   $scope.map.setCenter(homeLocation);
     
      };
    });