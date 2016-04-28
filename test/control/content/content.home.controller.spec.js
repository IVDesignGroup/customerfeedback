describe('Unit : Customer Feedback Plugin content.home.controller.js', function () {
    var ContentHome, $scope, $rootScope, $controller, STATUS_CODE, TAG_NAMES, Buildfire, $location, $timeout;
    beforeEach(module('customerFeedbackPluginContent'));
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
            datastore: {}
        };
        Buildfire.datastore = jasmine.createSpyObj('Buildfire.datastore', ['search', 'save', 'update', 'bulkInsert']);
        Buildfire.components.carousel = jasmine.createSpyObj('Buildfire.components.carousel', ['editor']);

        Buildfire.components.carousel.editor.and.callFake(function () {
            return {
                loadItems: function () {
                    console.log("egitor.loadItems hasbeen called");
                }
            };
        });
        Buildfire.datastore.search.and.callFake(function (opts, tname, cb) {
            cb({}, null);      // error case handle
        });
        Buildfire.datastore.update.and.callFake(function (id, data, tName, cb) {
            cb({}, null);     // error case handle
        });
        Buildfire.datastore.bulkInsert.and.callFake(function (rows, tName, cb) {
            cb({}, null);
        });
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
        it('TAG_NAMES should be defined and be an object', function () {
            expect(TAG_NAMES).toBeDefined();
            expect(typeof TAG_NAMES).toEqual('object');
        });
        it('STATUS_CODE should be defined and be an object', function () {
            expect(STATUS_CODE).toBeDefined();
            expect(typeof STATUS_CODE).toEqual('object');
        });
    });
})