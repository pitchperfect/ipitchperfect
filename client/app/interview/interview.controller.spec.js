'use strict';

describe('Controller: InterviewCtrl', function () {

  // load the controller's module
  beforeEach(module('pitchPerfectApp'));

  var InterviewCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();

    InterviewCtrl = $controller('InterviewCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
