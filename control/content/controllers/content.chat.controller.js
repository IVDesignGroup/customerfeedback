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
                        buildfire.userData.search({}, tagName, function (err, result) {
                            /*var saveResult = [];
                            if(result && result.length && result[0].data && result[0].data.length) {
                                saveResult = result[0].data;
                            }*/
                            result = result ? result : [];
                            result.push(ContentChat.chatMessageObj);
                            buildfire.userData.save(result, tagName, ContentChat.currentLoggedInUser._id, function (e, data) {
                                if (e) console.error("+++++++++++++++err", JSON.stringify(e));
                                else {
                                    console.log("+++++++++++++++success")
                                    ContentChat.getChatData();
                                    buildfire.messaging.sendMessageToWidget({'name': EVENTS.CHAT_ADDED, 'data': data});
                                    // $location.path('/chatHome')
                                    ContentChat.chatData = '';
                                    $scope.$apply();
                                    $location.path('/chat/' + $routeParams.userToken);
                                }
                            });
                        });
                        /*buildfire.userData.insert(ContentChat.chatMessageObj, 'chatData', $routeParams.userToken, function (e, data) {
                            if (e) console.error("+++++++++++++++err", JSON.stringify(e));
                            else {
                                console.log("+++++++++++++++success")
                                ContentChat.getChatData();
                                buildfire.messaging.sendMessageToWidget({'name': EVENTS.CHAT_ADDED, 'data': data});
                                ContentChat.chatData = '';
                                $scope.$apply();
                                $location.path('/chat/' + $routeParams.userToken)
                            }
                        });*/
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
                                    ContentChat.chatMessageData = event.data.data;
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

