'use strict';

(function (angular) {
    angular
        .module('customerFeedbackPluginContent')
        .controller('ContentChatCtrl', ['$scope', '$routeParams', '$location', 'Buildfire', 'TAG_NAMES', 'STATUS_CODE', 'DataStore',
            function ($scope, $routeParams, $location, Buildfire, TAG_NAMES, STATUS_CODE, DataStore) {
                var ContentChat = this;
                ContentChat.chatData = "";
                /*
                 * Go pull any previously saved data
                 * */
                 var init = function () {
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
                };

                ContentChat.sendMessage = function(){
                    buildfire.userData.insert( {chatMessage:ContentChat.chatData}, 'chatData', $routeParams.userToken, function (e) {
                        if (e) console.error("+++++++++++++++err",JSON.stringify(e));
                        else{
                            console.log("+++++++++++++++success")
                            $location.path('/chat/' + $routeParams.userToken)
                        }
                    });
                }

                init();
            }]);
})(window.angular);

