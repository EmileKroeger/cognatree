'use strict';

describe('Controller: DecompositionCtrl', function () {

  // load the controller's module
  beforeEach(module('cognatreeApp'));

  var DecompositionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DecompositionCtrl = $controller('DecompositionCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
