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

        buildfire.history.push('Events', { elementToShow: 'Event' });
        WidgetSubmit.Feedback = {
          Message : "",
          startRating:"",
          UserId:"",
          UserName: ""
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
          var objData = {startRating:WidgetSubmit.Feedback.startRating, Message:WidgetSubmit.Feedback.Message, displayName: WidgetSubmit.currentLoggedInUser.displayName, addedDate: new Date(), userName:WidgetSubmit.currentLoggedInUser.username, userImage:WidgetSubmit.currentLoggedInUser.imageUrl }
           console.log("++++++++++++++",objData)
          buildfire.userData.insert( objData, 'AppRatings2', function (e) {
            if (e) console.error("+++++++++++++++err",JSON.stringify(e));
            else{
              $location.path('/')
              $scope.$apply();
              console.log("+++++++++++++++success")
             }
          });
        }

        //WidgetSubmit.update = function () {
        //  //  $scope.complain.data.response = "";
        //  var objData = {startRating:WidgetSubmit.Feedback.startRating, Message:WidgetSubmit.Feedback.Message, displayName: WidgetSubmit.currentLoggedInUser.displayName, addedDate: new Date(), userName:WidgetSubmit.currentLoggedInUser.username}
        //  console.log("++++++++++++++",objData)
        //  buildfire.userData.update(WidgetSubmit.updateId, objData, 'AppRatings2', function (e) {
        //    if (e) console.error("+++++++++++++++err",JSON.stringify(e));
        //    else{
        //      $location.path('/')
        //      $scope.$apply();
        //      console.log("+++++++++++++++success")
        //    }
        //  });
        //}



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
            var searchData = {
              userName:WidgetSubmit.currentLoggedInUser.username
            }

            buildfire.userData.search(searchData,'AppRatings2', function (err, results) {
              console.log("+++++++++555",WidgetSubmit.currentLoggedInUser)
              if (err) console.error(JSON.stringify(err));
              else {
                if (results ) {
                  console.log("++++++++++33", results)
                  WidgetSubmit.Feedback = results[results.length-1].data;
                  WidgetSubmit.isUpdate = results.length;
                  WidgetSubmit.Feedback.Message = "";
                  //$scope.complain = results;
                  //  addContactRecord (  {name:"John Doe5", tel:"555-111-1111"} );

                  $scope.$apply();
                }
              }
            });
          }
          else
            WidgetSubmit.openLogin();
        });
      }]);
})(window.angular, window.buildfire);

