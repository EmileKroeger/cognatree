'use strict';

/**
 * @ngdoc directive
 * @name cognatreeApp.directive:flowgraph
 * @description
 * # flowgraph
 */
angular.module('cognatreeApp')
  .directive('flowgraph', function (d3Service) {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {

          var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 600 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;

          var x = d3.time.scale()
            .range([0, width]);

          var y = d3.scale.linear()
            .range([height, 0]);

          var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom');

          var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left');

          var line = d3.svg.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.close); });

          var svg = d3.select(element[0]).append('svg')
           .attr('width', width + margin.left + margin.right)
           .attr('height', height + margin.top + margin.bottom)
           .append('g')
           .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

          // Hard coded data
          scope.data = [
            {date: 4, close: 34},
            {date: 5, close: 45},
            {date: 6, close: 37},
            {date: 7, close: 56},
            {date: 8, close: 50},
            {date: 9, close: 77}
          ];

          scope.data.forEach(function(d) {
            d.date = +d.date;
            d.close = +d.close;
          });
          
          console.debug(d3.extent(scope.data, function(d) { return d.date; }));

          x.domain(d3.extent(scope.data, function(d) { return d.date; }));
          y.domain(d3.extent(scope.data, function(d) { return d.close; }));

          svg.append('path')
            .datum(scope.data)
            .attr('class', 'line')
            .attr('d', line);
            
          svg.selectAll('cicle')
            .data(scope.data)
            .enter().append('circle')
            .attr("r", function(d) { return 10; })
            .attr("cx", function(d, i) { return x(d.date); })
            .attr("cy", function(d) { return y(d.close); });
            
        });
      },
    };
  });
