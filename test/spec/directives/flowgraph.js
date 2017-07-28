'use strict';

describe('Directive: flowgraph', function () {

  // load the directive's module
  beforeEach(module('cognatreeApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<flowgraph></flowgraph>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the flowgraph directive');
  }));
});
