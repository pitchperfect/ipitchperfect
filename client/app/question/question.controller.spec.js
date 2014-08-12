'use strict';

describe('Controller: QuestionCtrl', function () {

  // load the controller's module
  beforeEach(module('pitchPerfectApp'));

  var QuestionCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $window, $timeout, $interval, QuestionFactory) {
    scope = $rootScope.$new();
    QuestionCtrl = $controller('QuestionCtrl', {
      $scope: scope,
      $window: $window,
      $timeout: $timeout,
      $interval: $interval,
      QuestionFactory: QuestionFactory
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
