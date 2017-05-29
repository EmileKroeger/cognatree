'use strict';

describe('Controller: LanguagesCtrl', function () {

  // load the controller's module
  beforeEach(module('cognatreeApp'));

  var LanguagesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LanguagesCtrl = $controller('LanguagesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
