'use strict';

describe('Controller: QuestionCtrl', function () {

  // load the controller's module
  beforeEach(module('pitchPerfectApp'));

  var QuestionCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    QuestionCtrl = $controller('QuestionCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
