'use strict';

(function (angular, buildfire) {
  angular
    .module('customerFeedbackPluginWidget')
    .controller('WidgetSubmitCtrl', ['$scope',
      function ($scope) {

        var WidgetSubmit = this;
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        /* Initialize current logged in user as null. This field is re-initialized if user is already logged in or user login user auth api.
         */
        WidgetSubmit.Feedback = {
          Message : ""
        }
        WidgetSubmit.currentLoggedInUser = null;
        WidgetSubmit.startPoints = 1.5;
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
          var objData = {name:"John Doaaae", tel:"8888851111111"}
          console.log("++++++++++++++",objData)
          buildfire.userData.save( WidgetSubmit.Feedback, 'Complains', function (e) {
            if (e) console.error("+++++++++++++++err",JSON.stringify(e));
            else{
              console.log("+++++++++++++++success")
             }
          });
        }


        //buildfire.userData.get('Complains', function (err, results) {
        //  if (err) console.error(JSON.stringify(err));
        //  else {
        //    if (results ) {
        //      console.log("++++++++++", results)
        //      //$scope.complain = results;
        //      $scope.$apply();
        //    }
        //  }
        //});


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

