'use strict';

(function (angular, buildfire) {
  angular.module('customerFeedbackPluginWidget', ['ngRoute', 'ngRateIt'])
    .config(['$routeProvider', '$compileProvider', function ($routeProvider, $compileProvider) {

      /**
       * To make href urls safe on mobile
       */
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|cdvfile|file):/);

        $routeProvider
            .when('/wall', {
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
      .run(['$rootScope', function ($rootScope) {
          buildfire.navigation.onBackButtonClick = function () {
                  buildfire.navigation._goBackOne();

          };
      }])
      ;
})(window.angular, window.buildfire);