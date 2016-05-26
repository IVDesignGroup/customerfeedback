describe('Unit : Customer Feedback Plugin content.home.controller.js', function () {
    var ContentHome, $scope, $rootScope, $controller, STATUS_CODE, TAG_NAMES, Buildfire, $location, $timeout;
    beforeEach(angular.mock.module('customerFeedbackPluginContent'));
    beforeEach(inject(function (_$rootScope_, _$controller_, _$timeout_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
         Buildfire = {
            spinner: {
                show: function () {
                    return true
                },
                hide: function () {
                    return true
                }
            },
            components: {
                carousel: {
                    editor: {}
                }
            },
            datastore: {},
             messaging:{onReceivedMessage:{}}
        };
        Buildfire.datastore = jasmine.createSpyObj('Buildfire.datastore', ['get', 'save', 'update']);

        Buildfire.messaging = jasmine.createSpyObj('Buildfire.messaging', [ 'onReceivedMessage']);

        Buildfire.components.carousel = jasmine.createSpyObj('Buildfire.components.carousel', ['editor']);

        Buildfire.components.carousel.editor.and.callFake(function () {
            return {
                loadItems: function () {
                    console.log("egitor.loadItems hasbeen called");
                }
            };
        });
        Buildfire.datastore.update.and.callFake(function (id, data, tName, cb) {
            cb({}, null);     // error case handle
        });
        Buildfire.datastore.get.and.callFake(function (id, data, tName, cb) {
            cb({}, null);     // error case handle
        });

       // Buildfire.messagging.onReceivedMessage.and.callFake("aaaa")// {
            //cb({}, null);     // error case handle
       // });
        $timeout = _$timeout_;
    }));

    beforeEach(function () {
        ContentHome = $controller('ContentHomeCtrl', {
            $scope: $scope,
            Buildfire: Buildfire,
            TAG_NAMES: TAG_NAMES,
            STATUS_CODE: STATUS_CODE,
            $timeout: $timeout
        });
    });
    describe('Units: units should be Defined', function () {
        it('Buildfire should be defined and be an object', function () {
            expect(Buildfire).toBeDefined();
            expect(typeof Buildfire).toEqual('object');
        });

    });
})