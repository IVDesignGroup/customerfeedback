describe('Unit : customerFeedbackPluginContent content Enums', function () {
  var TAG_NAMES, STATUS_CODE;
  beforeEach(angular.mock.module('customerFeedbackPluginContent'));

  beforeEach(inject(function (_TAG_NAME_, _STATUS_CODE_) {
    TAG_NAMES = _TAG_NAME_;
    STATUS_CODE = _STATUS_CODE_;
  }));

  describe('Enum : TAG_NAMES', function () {
    it('TAG_NAMES should exist and be an object', function () {
      expect(typeof TAG_NAMES).toEqual('object');
    });
    it('TAG_NAMES.FEEDBACK_APP_INFO should exist and equals to "FeedbackAppInfo"', function () {
      expect(TAG_NAMES.FEEDBACK_APP_INFO).toEqual('FeedbackAppInfo');
    });
  });

  describe('Enum : STATUS_CODE', function () {
    it('STATUS_CODE should exist and be an object', function () {
      expect(typeof STATUS_CODE).toEqual('object');
    });
    it('STATUS_CODE.INSERTED should exist and equals to "inserted"', function () {
      expect(STATUS_CODE.INSERTED).toEqual('inserted');
    });
    it('STATUS_CODE.UPDATED should exist and equals to "updated"', function () {
      expect(STATUS_CODE.UPDATED).toEqual('updated');
    });
    it('STATUS_CODE.NOT_FOUND should exist and equals to "NOTFOUND"', function () {
      expect(STATUS_CODE.NOT_FOUND).toEqual('NOTFOUND');
    });
  });

});
