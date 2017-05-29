'use strict';

describe('Directive: dendrogram', function () {

  // load the directive's module
  beforeEach(module('cognatreeApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<dendrogram></dendrogram>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the dendrogram directive');
  }));
});
