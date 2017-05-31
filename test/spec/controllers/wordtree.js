'use strict';

describe('Controller: WordtreeCtrl', function () {

  // load the controller's module
  beforeEach(module('cognatreeApp'));

  var WordtreeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WordtreeCtrl = $controller('WordtreeCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
