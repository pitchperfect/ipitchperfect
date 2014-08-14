'use strict';
/*globals it, spyOn */

describe('Controller: HomeCtrl', function () {
  // load the controller's module
  var HomeCtrl, $scope, HomeFactory, InterviewFactory, $state;

  beforeEach(module('pitchPerfectApp'));

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _HomeFactory_, _InterviewFactory_, _$state_) {
    $scope = $rootScope.$new();
    HomeFactory = _HomeFactory_;
    InterviewFactory = _InterviewFactory_;
    $state = _$state_;

    HomeCtrl = $controller('HomeCtrl', {
      $scope: $scope,
      HomeFactory: HomeFactory,
      InterviewFactory: InterviewFactory,
      $state: $state
    });
  }));

  it('properly sets allDecks with getDecksCb', function() {
    $scope.getDecksCb([1, 2]);
    expect($scope.allDecks).toEqual([1, 2]);
    expect($scope.allDecks.length).toEqual(2);
  });

  it('properly sets allUserDecks with getUserDecksCb', function() {
    $scope.getUserDecksCb([11, 12]);
    expect($scope.allUserDecks).toEqual([11, 12]);
    expect($scope.allUserDecks.length).toEqual(2);
  });

  it('checks that reload on page is called when reload is called', function() {
    spyOn(HomeFactory, 'getAllUserDecks');
    $scope.reloadPageContent();
    expect(HomeFactory.getAllUserDecks).toHaveBeenCalled();
  });

  it('sendToInterview should be updated', function() {
    var isUserDeck = true;
    var model = { title: 'a',
                  questionsStore: [] };
    $scope.sendToInterview(model, isUserDeck);

    expect(InterviewFactory.contextObject).toEqual(model);
    expect(InterviewFactory.workingFromUserDeck).toEqual(isUserDeck);

    // Test with different data
    isUserDeck = false;
    model = { title: 'b',
              description: 'something special',
              questionsStore: ['q1'] };
    $scope.sendToInterview(model, isUserDeck);

    expect(InterviewFactory.contextObject).toEqual(model);
    expect(InterviewFactory.workingFromUserDeck).toEqual(isUserDeck);
  });

  it('submitNewDeck calls HomeFactory.createDeck', function() {
    var postDeckObject = {
      title: 'a test deck',
      description: 'newDeckDescription',
      questionsCollection: ['q1?', 'q2?'],
      active: true,
    };

    spyOn(HomeFactory, 'createDeck');

    var cb = $scope.submitDeckCb;
    $scope.submitNewDeck(postDeckObject.title,
                         postDeckObject.description,
                         postDeckObject.questionsCollection[0],
                         postDeckObject.questionsCollection[1]);

    expect(HomeFactory.createDeck).toHaveBeenCalled();
    expect(HomeFactory.createDeck).toHaveBeenCalledWith(postDeckObject, cb);
  });

  it('should properly toggle submit box setting', function() {
    $scope.toggleSubmitBoxAppear();
    var firstToggle = $scope.submitBox;
    $scope.toggleSubmitBoxAppear();
    expect(firstToggle).toEqual(!$scope.submitBox);
  });


});
