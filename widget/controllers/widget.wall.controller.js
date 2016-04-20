'use strict';

(function (angular, buildfire) {
  angular
    .module('customerFeedbackPluginWidget')
      .controller('WidgetWallCtrl', ['$scope','$location',
        function ($scope, $location) {

          var WidgetWall = this;
         // buildfire.history.push('Submit Reviewsss', {});
          buildfire.userData.search({}, 'AppRatings2', function (err, results) {
            if (err){
              console.error("++++++++++++++ctrlerrddd",JSON.stringify(err));
              $location.path('/submit');
              $scope.$apply();
            }
            else {
              console.log("++++++++++++++ctrldd", results)
              if(!results.length) {
                $location.path('/submit');
              }else
              {
                WidgetWall.data= results;
                WidgetWall.lastRating = results[results.length-1].data.startRating;
              }
              //$scope.complains = results;
              $scope.$apply();
            }
          });

          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
          /* Initialize current logged in user as null. This field is re-initialized if user is already logged in or user login user auth api.
           */
          WidgetWall.currentLoggedInUser = null;

          /**
           * Method to open buildfire auth login pop up and allow user to login using credentials.
           */
          WidgetWall.openLogin = function () {
            buildfire.auth.login({}, function () {

            });
            $scope.$apply();
          };

          var loginCallback = function () {
            buildfire.auth.getCurrentUser(function (err, user) {
              console.log("_______________________rrr", user);

              $scope.$digest();
              if (user) {
                WidgetWall.currentLoggedInUser = user;
                $location.path('/submit');
                $scope.$apply();
              }
            });
          };

          WidgetWall.goBack = function(){
            $location.path("/submit");
          }
          /**
           * onLogin() listens when user logins using buildfire.auth api.
           */
          buildfire.auth.onLogin(loginCallback);

          /**
           * Check for current logged in user, if not show ogin screen
           */
          buildfire.auth.getCurrentUser(function (err, user) {
            console.log("_______________________ssss", user);
            if (user) {
              WidgetWall.currentLoggedInUser = user;
            }
            else
              WidgetWall.openLogin();
          });
        }]);
})(window.angular, window.buildfire);

