'use strict';

(function (angular, buildfire) {
  angular
    .module('customerFeedbackPluginWidget')
    .controller('WidgetSubmitCtrl', ['$scope','$location', '$rootScope', 'EVENTS', 'ViewStack',
      function ($scope, $location, $rootScope, EVENTS, ViewStack) {

        var WidgetSubmit = this;
        WidgetSubmit.currentView = ViewStack.getCurrentView();
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        /* Initialize current logged in user as null. This field is re-initialized if user is already logged in or user login user auth api.
         */

       // buildfire.history.push('Events', { elementToShow: 'Event' });
        WidgetSubmit.Feedback = {
          Message : "",
          startRating:"0.5",
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

        var logoutCallback = function () {
            WidgetSubmit.currentLoggedInUser = null;
        };

        WidgetSubmit.save = function () {
            if (WidgetSubmit.currentLoggedInUser) {
                //  $scope.complain.data.response = "";

                var objData = {startRating: WidgetSubmit.Feedback.startRating || 0.5, Message: WidgetSubmit.Feedback.Message, displayName: WidgetSubmit.currentLoggedInUser.displayName, addedDate: new Date(), userName: WidgetSubmit.currentLoggedInUser.username, userImage: WidgetSubmit.currentLoggedInUser.imageUrl }
                console.log("++++++++++++++", objData);
                if (WidgetSubmit.Feedback.Message) {
                    buildfire.userData.insert(objData, 'AppRatings2', function (err, data) {
                        if (err) console.error("+++++++++++++++err", JSON.stringify(err));
                        else {
                            data.userToken = WidgetSubmit.currentLoggedInUser._id;
                            console.log('>>>>>>>>>>>>>>>>>>>', data);
                            buildfire.messaging.sendMessageToControl({'name': EVENTS.REVIEW_CREATED, 'data': data, 'lastReviewCount': ((WidgetSubmit.currentView && WidgetSubmit.currentView.params && WidgetSubmit.currentView.params.lastReviewCount) || 0)});
                            $rootScope.$broadcast(EVENTS.REVIEW_CREATED, {'data': data, 'lastReviewCount': ((WidgetSubmit.currentView && WidgetSubmit.currentView.params && WidgetSubmit.currentView.params.lastReviewCount) || 0)});
//                      $location.path('/');
                            $scope.$apply();
                            console.log("+++++++++++++++success");
                            ViewStack.pop();
                        }
                    });
                }
            } else {
                WidgetSubmit.openLogin();
            }
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
        buildfire.auth.onLogout(logoutCallback);
        /**
         * Check for current logged in user, if not show Login screen
         */
        buildfire.auth.getCurrentUser(function (err, user) {
          console.log("_______________________", user);
          if (user) {
            WidgetSubmit.currentLoggedInUser = user;
            var searchData = {
              userName:WidgetSubmit.currentLoggedInUser.username
            }

           /* buildfire.userData.search(searchData,'AppRatings2', function (err, results) {
              console.log("+++++++++555",WidgetSubmit.currentLoggedInUser)
              if (err) console.error(JSON.stringify(err));
              else {
                if (results && results.length) {
                  console.log("++++++++++33", results)
                  WidgetSubmit.Feedback = results[results.length-1].data;
                  WidgetSubmit.isUpdate = results.length;
                  WidgetSubmit.Feedback.Message = "";
                  //$scope.complain = results;
                  //  addContactRecord (  {name:"John Doe5", tel:"555-111-1111"} );

                  $scope.$apply();
                }
              }
            });*/
          }
          else
            WidgetSubmit.openLogin();
        });
        WidgetSubmit.rating1 = 5;
        WidgetSubmit.rating2 = 2;
        WidgetSubmit.isReadonly = true;
        WidgetSubmit.rateFunction = function(rating) {
          console.log('Rating selected: ' + rating);
        };
      }])    .directive('starRating', starRating);



  function starRating() {
    return {
      restrict: 'EA',
      template:
      '<ul class="star-rating" ng-class="{readonly: readonly}">' +
      '  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled}" ng-click="toggle($index)">' +
      '    <i class="icon icon-bookmark2"></i>' + // or &#9733
      '  </li>' +
      '</ul>',
      scope: {
        ratingValue: '=ngModel',
        max: '=?', // optional (default is 5)
        onRatingSelect: '&?',
        readonly: '=?'
      },
      link: function(scope, element, attributes) {
        if (scope.max == undefined) {
          scope.max = 5;
        }
        function updateStars() {
          scope.stars = [];
          for (var i = 0; i < scope.max; i++) {
            scope.stars.push({
              filled: i < scope.ratingValue
            });
          }
        };
        scope.toggle = function(index) {
          if (scope.readonly == undefined || scope.readonly === false){
            scope.ratingValue = index + 1;
            scope.onRatingSelect({
              rating: index + 1
            });
          }
        };
        scope.$watch('ratingValue', function(oldValue, newValue) {
          if (newValue) {
            updateStars();
          }
        });
      }
    };
  };
})(window.angular, window.buildfire);

