'use strict';

(function (angular, buildfire) {
  angular
    .module('customerFeedbackPluginWidget')
    .controller('WidgetHomeCtrl', ['$scope','$location', '$rootScope', 'DataStore', 'TAG_NAMES',
      function ($scope, $location, $rootScope, DataStore, TAG_NAMES) {
        var WidgetHome = this;

        function init() {
            var success = function (result) {
                    WidgetHome.data = result.data;
                    if (!WidgetHome.data.design)
                        WidgetHome.data.design = {};
                    /*if (!WidgetHome.data.content)
                        WidgetHome.data.content = {};*/
                    console.log("WidgetHome.data.design.backgroundImage", WidgetHome.data.design.backgroundImage);
                    if (!WidgetHome.data.design.backgroundImage) {
                        $rootScope.backgroundImage = "";
                    } else {
                        $rootScope.backgroundImage = WidgetHome.data.design.backgroundImage;
                    }
                    getReviews();
                }
                , error = function (err) {
                    console.error('Error while getting data', err);
                };
            DataStore.get(TAG_NAMES.FEEDBACK_APP_INFO).then(success, error);
        }

        init();

        function getReviews() {
            buildfire.userData.search({}, 'AppRatings2', function (err, results) {
                if (err){
                    console.error("++++++++++++++ctrlerrddd",JSON.stringify(err));
                    $location.path('/submit');
                    $scope.$apply();
                }
                else {
                    console.log("++++++++++++++ctrldd", results);
                    if(!results.length) {
                        $location.path('/submit');
                    }else
                    {
                        WidgetHome.data.reviews = results;
                        WidgetHome.lastRating = results[results.length-1].data.startRating;
                    }
                    //$scope.complains = results;
                    $scope.$apply();
                }
            });
        }

        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        /* Initialize current logged in user as null. This field is re-initialized if user is already logged in or user login user auth api.
         */
        WidgetHome.currentLoggedInUser = null;

        /**
         * Method to open buildfire auth login pop up and allow user to login using credentials.
         */
        WidgetHome.openLogin = function () {
          buildfire.auth.login({}, function () {

          });
          $scope.$apply();
        };

        var loginCallback = function () {
          buildfire.auth.getCurrentUser(function (err, user) {
            console.log("_______________________rrr", user);

            $scope.$digest();
            if (user) {
              WidgetHome.currentLoggedInUser = user;
              $location.path('/submit');
              $scope.$apply();
            }
          });
        };

        WidgetHome.goBack = function(){
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
            WidgetHome.currentLoggedInUser = user;
          }
          else
            WidgetHome.openLogin();
        });

          var onUpdateCallback = function (event) {

              setTimeout(function () {
                  if (event) {
                      switch (event.tag) {
                          case TAG_NAMES.FEEDBACK_APP_INFO:
                              WidgetHome.data = event.data;
                              if (!WidgetHome.data.design)
                                  WidgetHome.data.design = {};
                              /*if (!WidgetHome.data.content)
                                  WidgetHome.data.content = {};*/
                              if (!event.data.design.backgroundImage) {
                                  $rootScope.backgroundImage = "";
                              } else {
                                  $rootScope.backgroundImage = event.data.design.backgroundImage;
                              }
                              break;
                      }
                      $rootScope.$digest();
                  }
              }, 0);
          };

          /**
           * DataStore.onUpdate() is bound to listen any changes in datastore
           */
          DataStore.onUpdate().then(null, null, onUpdateCallback);
      }]);
})(window.angular, window.buildfire);

