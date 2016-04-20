'use strict';

(function (angular, buildfire) {
  angular.module('customerFeedbackPluginWidget')
    .provider('Buildfire', [function () {
      var Buildfire = this;
      Buildfire.$get = function () {
        return buildfire
      };
      return Buildfire;
    }])
    .factory("DataStore", ['Buildfire', '$q', 'STATUS_CODE', 'STATUS_MESSAGES', function (Buildfire, $q, STATUS_CODE, STATUS_MESSAGES) {
      return {
        get: function (_tagName) {
          var deferred = $q.defer();
          Buildfire.datastore.get(_tagName, function (err, result) {
            if (err) {
              return deferred.reject(err);
            } else if (result) {
              return deferred.resolve(result);
            }
          });
          return deferred.promise;
        },
          onUpdate: function () {
              var deferred = $q.defer();
              var onUpdateFn = Buildfire.datastore.onUpdate(function (event) {
                  if (!event) {
                      return deferred.notify(new Error({
                          code: STATUS_CODE.UNDEFINED_DATA,
                          message: STATUS_MESSAGES.UNDEFINED_DATA
                      }), true);
                  } else {
                      return deferred.notify(event);
                  }
              });
              return deferred.promise;
          }
      }
    }]);
})(window.angular, window.buildfire);