'use strict';

(function (angular) {
    angular
        .module('customerFeedbackPluginContent')
        .controller('ContentChatCtrl', ['$scope', '$routeParams', '$location', 'Buildfire', 'TAG_NAMES', 'STATUS_CODE', 'DataStore','EVENTS',
            function ($scope, $routeParams, $location, Buildfire, TAG_NAMES, STATUS_CODE, DataStore, EVENTS) {
                var ContentChat = this;
                ContentChat.chatData = "";
                /*
                 * Go pull any previously saved data
                 * */

                ContentChat.getChatData = function(){
                    buildfire.userData.search({}, 'chatData', function (err, results) {
                        if (err){
                            console.error("Error",JSON.stringify(err));
                        }
                        else {
                            console.log("++++++++++++++successsChat", results)
                            ContentChat.chatMessageData= results;
                            //$scope.complains = results;
                            $scope.$apply();
                        }
                    });
                }
                 var init = function () {
                     ContentChat.getChatData();
                };

                ContentChat.sendMessage = function() {
                    ContentChat.chatMessageObj =
                    {
                        chatMessage: ContentChat.chatData,
                        chatTime: new Date(),
                        chatFrom: 'App Owner'
                    }
                    if (ContentChat.chatData) {
                        buildfire.userData.insert(ContentChat.chatMessageObj, 'chatData', $routeParams.userToken, function (e, data) {
                            if (e) console.error("+++++++++++++++err", JSON.stringify(e));
                            else {
                                console.log("+++++++++++++++success")
                                ContentChat.getChatData();
                                buildfire.messaging.sendMessageToWidget({'name': EVENTS.CHAT_ADDED, 'data': data});
                                ContentChat.chatData = '';
                                $scope.$apply();
                                $location.path('/chat/' + $routeParams.userToken)
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
                                    ContentChat.chatMessageData.push(event.data);
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

