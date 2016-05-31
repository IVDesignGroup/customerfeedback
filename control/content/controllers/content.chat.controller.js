'use strict';

(function (angular) {
    angular
        .module('customerFeedbackPluginContent')
        .controller('ContentChatCtrl', ['$scope', '$routeParams', '$location', 'Buildfire', 'TAG_NAME', 'STATUS_CODE', 'DataStore','EVENTS',
            function ($scope, $routeParams, $location, Buildfire, TAG_NAME, STATUS_CODE, DataStore, EVENTS) {
                var ContentChat = this;
                var tagName = 'chatData-' + $routeParams.userToken;
                ContentChat.chatData = "";
                /*
                 * Go pull any previously saved data
                 * */

                buildfire.auth.getCurrentUser(function (err, user) {
                    console.log("_______________________ssss", user);
                    if (user) {
                        ContentChat.currentLoggedInUser = user;
                        ContentChat.getChatData();
                    }
                });

                ContentChat.getChatData = function(){
                    buildfire.userData.search({}, tagName, function (err, results) {
                        if (err){
                            console.error("Error",JSON.stringify(err));
                        }
                        else {
                            console.log("++++++++++++++successsChat", results);
                            ContentChat.chatMessageData = results;
                            //$scope.complains = results;
                            $scope.$apply();
                        }
                    });
                }
                 var init = function () {
                     ContentChat.getChatData();
                     /**
                      * Check for current logged in user, if not show ogin screen
                      */
                     buildfire.auth.getCurrentUser(function (err, user) {
                         console.log("_______________________ssss", user);
                         if (user) {
                             ContentChat.currentLoggedInUser = user;
                         }
                     });
                };

                ContentChat.sendMessage = function() {
                    ContentChat.chatMessageObj =
                    {
                        chatMessage: ContentChat.chatData,
                        chatTime: new Date(),
                        chatFrom: ContentChat.currentLoggedInUser.displayName,
                        id: ContentChat.currentLoggedInUser._id
                    }
                    if (ContentChat.chatData) {
                            buildfire.userData.insert(ContentChat.chatMessageObj, tagName, $routeParams.userToken, function (err, result) {
                                if (err) console.error("Error : ", JSON.stringify(err));
                                else {
                                    ContentChat.chatMessageData.unshift(result);
                                    buildfire.messaging.sendMessageToWidget({'name': EVENTS.CHAT_ADDED, 'data': result});
                                    ContentChat.chatData = '';
                                    $scope.$apply();
//                                    $location.path('/chat/' + $routeParams.userToken);
                                }
                            });
                    }
                }

                init();
                buildfire.messaging.onReceivedMessage = function (event) {
                    console.log('Content syn called method in content.home.controller called-----', event);
                    if (event) {
                        console.log("++++++++++++", event)
                        switch (event.name) {
                            case EVENTS.CHAT_ADDED :
                                if (event.data.data) {
                                    ContentChat.chatMessageData = ContentChat.chatMessageData ? ContentChat.chatMessageData : [];
                                    ContentChat.chatMessageData.unshift(event.data);
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
})(window.angular);

