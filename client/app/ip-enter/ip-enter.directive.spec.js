'use strict';

describe('Directive: ipEnter', function () {

  // load the directive's module
  beforeEach(module('pitchPerfectApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ip-enter></ip-enter>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ipEnter directive');
  }));
});