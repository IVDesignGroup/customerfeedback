'use strict';

(function (angular, buildfire) {
  angular
    .module('customerFeedbackPluginWidget')
    .controller('WidgetSubmitCtrl', ['$scope','$location',
      function ($scope, $location) {

        var WidgetSubmit = this;
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        /* Initialize current logged in user as null. This field is re-initialized if user is already logged in or user login user auth api.
         */
        WidgetSubmit.Feedback = {
          Message : "",
          startRating:""
        }
        WidgetSubmit.currentLoggedInUser = null;
        /**
         * Method to open buildfire auth login pop up and allow user to login using credentials.
         */
        WidgetSubmit.openLogin = function () {
          buildfire.auth.login({}, function () {

          });
        };


        var loginCallback = function () {
          buildfire.auth.getCurrentUser(function (err, user) {
            console.log("_______________________", user);
            if (user) {
              WidgetSubmit.currentLoggedInUser = user;
              $scope.$digest();
            }
          });
        };

        WidgetSubmit.save = function () {
          //  $scope.complain.data.response = "";
          var objData = {startRating:WidgetSubmit.Feedback.startRating, Message:WidgetSubmit.Feedback.Message, displayName: WidgetSubmit.currentLoggedInUser.displayName, addedDate: new Date()}
           console.log("++++++++++++++",objData)
          buildfire.userData.save( objData, 'Feedback', function (e) {
            if (e) console.error("+++++++++++++++err",JSON.stringify(e));
            else{
              $location.path('/')
              $scope.$apply();
              console.log("+++++++++++++++success")
             }
          });
        }


        buildfire.userData.get('Feedback', function (err, results) {
          if (err) console.error(JSON.stringify(err));
          else {
            if (results ) {
              console.log("++++++++++33", results)
              WidgetSubmit.Feedback = results.data;
              //$scope.complain = results;

              $scope.$apply();
            }
          }
        });


        //WidgetSubmit.save();
        /**
         * onLogin() listens when user logins using buildfire.auth api.
         */
        buildfire.auth.onLogin(loginCallback);

        /**
         * Check for current logged in user, if not show ogin screen
         */
        buildfire.auth.getCurrentUser(function (err, user) {
          console.log("_______________________", user);
          if (user) {
            WidgetSubmit.currentLoggedInUser = user;
          }
          else
            WidgetSubmit.openLogin();
        });
      }]);
})(window.angular, window.buildfire);

