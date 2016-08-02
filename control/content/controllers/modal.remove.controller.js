'use strict';

(function (angular) {
  angular
    .module('customerFeedbackPluginContent')
    .controller('RemovePopupCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
      var RemovePopup = this;
      RemovePopup.ok = function () {
        $modalInstance.close('yes');
      };
      RemovePopup.cancel = function () {
        $modalInstance.dismiss('No');
      };
    }])
})(window.angular);
