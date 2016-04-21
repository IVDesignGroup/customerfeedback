'use strict';

(function (angular, buildfire) {
  angular.module('customerFeedbackPluginWidget', ['ngRoute', 'ngRateIt'])
    .config(['$routeProvider', '$compileProvider', function ($routeProvider, $compileProvider) {

      /**
       * To make href urls safe on mobile
       */
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|cdvfile|file):/);

        $routeProvider
            .when('/chatHome', {
              templateUrl: 'templates/home.html',
              controllerAs: 'WidgetHome',
              controller: 'WidgetHomeCtrl'
            }).when('/', {
              templateUrl: 'templates/wall.html',
              controllerAs: 'WidgetWall',
              controller: 'WidgetWallCtrl'
            }).when('/submit', {
              templateUrl: 'templates/submit.html',
              controllerAs: 'WidgetSubmit',
              controller: 'WidgetSubmitCtrl'
            })
            .otherwise('/');
      }])
      .filter('cropImage', [function () {
          return function (url, width, height, noDefault) {
              if (noDefault) {
                  if (!url)
                      return '';
              }
              return buildfire.imageLib.cropImage(url, {
                  width: width,
                  height: height
              });
          };
      }])
      .run(['$rootScope', '$location', function ($rootScope, $location) {
          buildfire.navigation.onBackButtonClick = function () {
              $location.path('/')
              $rootScope.$apply();


          };
          //buildfire.history.onPop(function(breadcrumb) {
          //   console.log("=====================",breadcrumb)
          //});

      }])
      ;
})(window.angular, window.buildfire);