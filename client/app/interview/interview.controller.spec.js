'use strict';

describe('Controller: InterviewCtrl', function () {

  // load the controller's module
  beforeEach(module('pitchPerfectApp'));

  var InterviewCtrl, $scope, $window, $interval, InterviewFactory, QuestionFactory, $state;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$window_, _$interval_,
                              _InterviewFactory_, _QuestionFactory_, _$state_) {
    $scope = $rootScope.$new();
    $window = _$window_;
    $interval = _$interval_;
    InterviewFactory = _InterviewFactory_;
    QuestionFactory = _QuestionFactory_;
    $state = _$state_;

    InterviewCtrl = $controller('InterviewCtrl', {
      $scope: $scope,
      $window: $window,
      $interval: $interval,
      InterviewFactory: InterviewFactory,
      QuestionFactory: QuestionFactory,
      $state: $state
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
