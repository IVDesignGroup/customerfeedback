'use strict';

(function (angular, buildfire) {
  angular
    .module('customerFeedbackPluginWidget')
    .controller('WidgetHomeCtrl', ['$scope','$location', '$rootScope', '$sce', 'DataStore', 'TAG_NAMES','EVENTS',
      function ($scope, $location, $rootScope, $sce, DataStore, TAG_NAMES, EVENTS) {
        var WidgetHome = this;
        WidgetHome.chatData = "";
          $rootScope.deviceHeight = window.innerHeight;
          $rootScope.deviceWidth = window.innerWidth;
          $rootScope.backgroundImage = "";

          WidgetHome.safeHtml = function (html) {
              if (html) {
                  var $html = $('<div />', {html: html});
                  $html.find('iframe').each(function (index, element) {
                      var src = element.src;
                      console.log('element is: ', src, src.indexOf('http'));
                      src = src && src.indexOf('file://') != -1 ? src.replace('file://', 'http://') : src;
                      element.src = src && src.indexOf('http') != -1 ? src : 'http:' + src;
                  });
                  return $sce.trustAsHtml($html.html());
              }
          };

        function init() {
            var success = function (result) {
                    WidgetHome.data = result.data;
                    if (!WidgetHome.data.design)
                        WidgetHome.data.design = {};
                    if (!WidgetHome.data.content)
                        WidgetHome.data.content = {};
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

            /**
             * Check for current logged in user, if not show ogin screen
             */
            buildfire.auth.getCurrentUser(function (err, user) {
                console.log("_______________________ssss", user);
                if (user) {
                    WidgetHome.currentLoggedInUser = user;
                    WidgetHome.getChatData();
                }
                else
                    WidgetHome.openLogin();
            });
        }

        init();

          WidgetHome.showDescription = function (description) {
              console.log('Description---------------------------------------', description);
              if (typeof description != 'undefined')
                  return !((description == '<p>&nbsp;<br></p>') || (description == '<p><br data-mce-bogus="1"></p>') || (description == ''));
              else
                  return false;
          };

        function getReviews() {
                buildfire.userData.search({}, 'AppRatings2', function (err, results) {
                    if (err){
                        console.error("++++++++++++++ctrlerrddd",JSON.stringify(err));
                        $location.path('/');
                        $scope.$apply();
                    }
                    else {
                        console.log("++++++++++++++ctrldd home", results)

                        WidgetHome.data.reviews = results;
                        //WidgetWall.lastRating = results[results.length-1].data.startRating;
                        WidgetHome.lastRating = results.reduce(function (a, b) {
                            return {data:{startRating: a.data.startRating + b.data.startRating}}; // returns object with property x
                        })
                        WidgetHome.startPoints = WidgetHome.lastRating.data.startRating / (WidgetHome.data.reviews.length )
                        WidgetHome.lastReviewComment = WidgetHome.data.reviews[WidgetHome.data.reviews.length-1].data.Message;
                        WidgetHome.lastRating = WidgetHome.data.reviews[WidgetHome.data.reviews.length-1].data.startRating;
                        //$scope.complains = results;
                        $scope.$apply();
                    }
                });
        }

        WidgetHome.getChatData = function () {
            var tagName = 'chatData-' + WidgetHome.currentLoggedInUser._id;
            buildfire.userData.get(tagName, function (err, result) {
                if (err){
                    console.error("Error",JSON.stringify(err));
                }
                else {
                    console.log("++++++++++++++successsChat", result);
                    WidgetHome.chatMessageData= result && result.data;
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
              WidgetHome.getChatData();
              $location.path('/submit');
              $scope.$apply();
            }
          });
        };

        WidgetHome.goBack = function(){
          $location.path("/submit");
        }

        WidgetHome.sendMessage = function(){
            var tagName = 'chatData-' + WidgetHome.currentLoggedInUser._id;
            WidgetHome.chatMessageObj=
            {
                chatMessage:WidgetHome.chatData,
                chatTime: new Date(),
                chatFrom: WidgetHome.currentLoggedInUser.displayName,
                id: WidgetHome.currentLoggedInUser._id
            }

            WidgetHome.getChatData();
          if(WidgetHome.chatData!=''){
            buildfire.userData.get(tagName, function (err, result) {
                var saveResult = [];
                if(result && result.data && result.data.length) {
                    saveResult = result && result.data;
                }
                saveResult.push(WidgetHome.chatMessageObj);
                buildfire.userData.save(saveResult, tagName, function (e, data) {
                    if (e) console.error("+++++++++++++++err", JSON.stringify(e));
                    else {
                        WidgetHome.chatData = '';
                        buildfire.messaging.sendMessageToControl({'name': EVENTS.CHAT_ADDED, 'data': data});
                        // $location.path('/chatHome')
                        WidgetHome.getChatData();
                        $scope.$apply();
                        console.log("+++++++++++++++success")
                    }
                });
            });
          }
        }
        /**
         * onLogin() listens when user logins using buildfire.auth api.
         */
        buildfire.auth.onLogin(loginCallback);

          $rootScope.$on("Carousel:LOADED", function () {
              WidgetHome.view = null;
              if (!WidgetHome.view) {
                  WidgetHome.view = new buildfire.components.carousel.view("#carousel", [], "WideScreen");
              }
              if (WidgetHome.data && WidgetHome.data.content.carouselImages) {
                  WidgetHome.view.loadItems(WidgetHome.data.content.carouselImages, null, "WideScreen");
              } else {
                  WidgetHome.view.loadItems([]);
              }
          });

          var onUpdateCallback = function (event) {

              setTimeout(function () {
                  if (event) {
                      switch (event.tag) {
                          case TAG_NAMES.FEEDBACK_APP_INFO:
                              WidgetHome.data = event.data;
                              if (!WidgetHome.data.design)
                                  WidgetHome.data.design = {};
                              if (!WidgetHome.data.content)
                                  WidgetHome.data.content = {};
                              if (!event.data.design.backgroundImage) {
                                  $rootScope.backgroundImage = "";
                              } else {
                                  $rootScope.backgroundImage = event.data.design.backgroundImage;
                              }
                              if (WidgetHome.view) {
                                  WidgetHome.view.loadItems(WidgetHome.data.content.carouselImages);
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

          buildfire.messaging.onReceivedMessage = function (event) {
              console.log('Content syn called method in content.home.controller called-----', event);
              if (event) {
                  console.log("++++++++++++", event);
                  switch (event.name) {
                      case EVENTS.CHAT_ADDED :
                          if (event.data.data) {
                              WidgetHome.chatMessageData = event.data.data;
                          }
                          break;
                      default :
                          break;
                  }
                  if (!$scope.$$phase)
                      $scope.$digest();
              }
          };
      }]);
})(window.angular, window.buildfire);

