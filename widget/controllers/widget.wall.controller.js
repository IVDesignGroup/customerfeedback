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
              $location.path('/');
              $scope.$apply();
            }
            else {
              console.log("++++++++++++++ctrldd", results)

                WidgetWall.data= results;
                //WidgetWall.lastRating = results[results.length-1].data.startRating;
                WidgetWall.lastRating = results.reduce(function (a, b) {
                  return {data:{startRating: a.data.startRating + b.data.startRating}}; // returns object with property x
                })
              WidgetWall.startPoints = WidgetWall.lastRating.data.startRating / (WidgetWall.data.length )
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
                $location.path('/');
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

