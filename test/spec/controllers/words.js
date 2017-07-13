'use strict';

describe('Controller: WordsCtrl', function () {

  // load the controller's module
  beforeEach(module('cognatreeApp'));

  var WordsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WordsCtrl = $controller('WordsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
