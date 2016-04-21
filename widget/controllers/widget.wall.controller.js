'use strict';

(function (angular, buildfire) {
  angular
    .module('customerFeedbackPluginWidget')
      .controller('WidgetWallCtrl', ['$scope','$location', '$rootScope', 'DataStore', 'TAG_NAMES',
        function ($scope, $location, $rootScope, DataStore, TAG_NAMES) {

          var WidgetWall = this;

          console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
          /* Initialize current logged in user as null. This field is re-initialized if user is already logged in or user login user auth api.
           */
          WidgetWall.currentLoggedInUser = null;

            function init() {
                var success = function (result) {
                        WidgetWall.data = result.data;
                        if (!WidgetWall.data.design)
                            WidgetWall.data.design = {};
                        /*if (!WidgetHome.data.content)
                         WidgetHome.data.content = {};*/
                        console.log("WidgetHome.data.design.backgroundImage", WidgetWall.data.design.backgroundImage);
                        if (!WidgetWall.data.design.backgroundImage) {
                            $rootScope.backgroundImage = "";
                        } else {
                            $rootScope.backgroundImage = WidgetWall.data.design.backgroundImage;
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
                // buildfire.history.push('Submit Reviewsss', {});
                buildfire.userData.search({}, 'AppRatings2', function (err, results) {
                    if (err){
                        console.error("++++++++++++++ctrlerrddd",JSON.stringify(err));
                        $location.path('/');
                        $scope.$apply();
                    }
                    else {
                        console.log("++++++++++++++ctrldd", results)

                        WidgetWall.data.reviews = results;
                        //WidgetWall.lastRating = results[results.length-1].data.startRating;
                        WidgetWall.lastRating = results.reduce(function (a, b) {
                            return {data:{startRating: a.data.startRating + b.data.startRating}}; // returns object with property x
                        })
                        WidgetWall.startPoints = WidgetWall.lastRating.data.startRating / (WidgetWall.data.reviews.length )
                        //$scope.complains = results;
                        $scope.$apply();
                    }
                });
            }

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
                console.log("_______________________rrr22", user);
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

            var onUpdateCallback = function (event) {

                setTimeout(function () {
                    if (event) {
                        switch (event.tag) {
                            case TAG_NAMES.FEEDBACK_APP_INFO:
                                WidgetWall.data = event.data;
                                if (!WidgetWall.data.design)
                                    WidgetWall.data.design = {};
                                /*if (!WidgetWall.data.content)
                                 WidgetWall.data.content = {};*/
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

