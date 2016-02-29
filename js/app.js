// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  $ionicPlatform.registerBackButtonAction(function (e) {
   //console.log("pressed back");
   e.preventDefault();
    }, 100);

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html'
       // controller: 'homeCtrl'
      }
    }
  })

  .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html'
        }
      }
    })
  .state('app.about', {
      url: '/about',
      views: {
        'menuContent': {
          templateUrl: 'templates/about.html'
        }
      }
    })
  .state('app.exit', {
      url: '/exit',
      views: {
        'menuContent': {
          templateUrl: 'templates/exit.html',
          controller: 'exitCtrl'
        }
      }
    })
    .state('app.mapPage', {
      url: '/mapPage',
      views: {
        'menuContent': {
          templateUrl: 'templates/mapPage.html'
        }
      }
    })
    .state('app.savedDestinations', {
      url: '/savedDestinations',
      views: {
        'menuContent': {
          templateUrl: 'templates/savedDestinations.html',
          controller: 'savedDestinationsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/savedDestinations/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/SingleSavedDestination.html',
        controller: 'savedDestinationCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
