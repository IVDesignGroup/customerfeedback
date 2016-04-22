'use strict';

(function (angular) {
  angular.module('customerFeedbackPluginContent', ['ngRoute', 'ui.tinymce', 'ui.bootstrap', 'ngRateIt'])
    //injected ngRoute for routing
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'templates/home.html',
          controllerAs: 'ContentHome',
          controller: 'ContentHomeCtrl'
        })
          .when('/chat', {
              templateUrl: 'templates/chat.html',
              controllerAs: 'ContentChat',
              controller: 'ContentChatCtrl'
          })
          .when('/chat/:userToken', {
              templateUrl: 'templates/chat.html',
              controllerAs: 'ContentChat',
              controller: 'ContentChatCtrl'
          })
        .otherwise('/');
    }])
    .filter('getImageUrl', ['Buildfire', function (Buildfire) {
      return function (url, width, height, type) {
        if (type == 'resize')
          return Buildfire.imageLib.resizeImage(url, {
            width: width,
            height: height
          });
        else
          return Buildfire.imageLib.cropImage(url, {
            width: width,
            height: height
          });
      }
    }]);
})(window.angular);