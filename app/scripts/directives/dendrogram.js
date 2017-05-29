'use strict';

/**
 * @ngdoc directive
 * @name cognatreeApp.directive:dendrogram
 * @description
 * # dendrogram
 */
angular.module('cognatreeApp')
  .directive('dendrogram', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      scope: {
        tree: '=',
      },
      link: function postLink(scope, element, attrs) {
        function insert(el, node) {
          console.debug('processing...')
          console.debug(node)
          if (typeof node === 'string') {
            $('<div>').text(node).appendTo(el);
            //el.append(node);
          } else {
            var newDiv = $('<div>').addClass('node');
            newDiv.appendTo(el);
            insert(newDiv, node[0]);
            insert(newDiv, node[1]);
          }
        }
        //element.text('this is the dendrogram directive');
        console.debug('todo: draw a nice dendrogram');
        console.debug(scope.tree)
        insert(element, scope.tree)
      }
    };
  });
