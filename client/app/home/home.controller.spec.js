'use strict';

describe('Controller: HomeCtrl', function () {
  // load the controller's module
  var HomeCtrl, $scope, $http, HomeFactory, $resource, InterviewFactory, $state;

  beforeEach(module('pitchPerfectApp'));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$http_, _HomeFactory_, _$resource_, _InterviewFactory_, _$state_) {
    $scope = $rootScope.$new();
    $http = _$http_;
    HomeFactory = _HomeFactory_;
    $resource = _$resource_;
    InterviewFactory = _InterviewFactory_;
    $state = _$state_;

    HomeCtrl = $controller('HomeCtrl', {
      $scope: $scope,
      $http: $http,
      HomeFactory: HomeFactory,
      $resource: $resource,
      InterviewFactory: InterviewFactory,
      $state: $state
    });
  }));


  it('should properly toggle submit box setting', function() {
    // toggleSubmitBoxAppear
    $scope.toggleSubmitBoxAppear();
    var firstToggle = $scope.submitBox;
    $scope.toggleSubmitBoxAppear();
    expect(firstToggle).toEqual(!$scope.submitBox);
  });

});
