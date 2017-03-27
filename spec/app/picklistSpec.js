describe("Picklist directive", function() {
    var $compile, $rootScope;

    beforeEach(angular.mock.module('app'));

    beforeEach(angular.mock.inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('should initialize successfully', function() {
        var element = $compile("<picklist data-groups='[]' data-features='[]' data-control='{}'></picklist>")($rootScope);
        $rootScope.$digest();
        expect(element.html()).toContain("select");
    });
});
