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
      
      var width = 800;
      var height = 800;

      var svg = d3.select(element[0]).append('svg')
        .attr("width", width)
        .attr("height", height)
      //var svg = d3.select("svg"),
      //    width = +svg.attr("width"),
      //    height = +svg.attr("height");

      var formatNumber = d3.format(",.0f"),
          format = function(d) { return formatNumber(d) + " TWh"; },
          color = d3.scaleOrdinal(d3.schemeCategory10);

      var sankey = d3.sankey()
          .nodeWidth(15)
          .nodePadding(10)
          .extent([[1, 1], [width - 1, height - 6]]);
      
          window.sankey = sankey;

      var link = svg.append("g")
          .attr("class", "links")
          .attr("fill", "none")
          .attr("stroke", "#000")
          .attr("stroke-opacity", 0.2)
        .selectAll("path");

      var node = svg.append("g")
          .attr("class", "nodes")
          .attr("font-family", "sans-serif")
          .attr("font-size", 10)
        .selectAll("g");

      d3.json("data/energy.json", function(error, energy) {
        if (error) throw error;

        sankey(energy);

        link = link
          .data(energy.links)
          .enter().append("path")
            .attr("d", d3.sankeyLinkHorizontal())
            .attr("stroke-width", function(d) { return Math.max(1, d.width); });

        link.append("title")
            .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

        node = node
          .data(energy.nodes)
          .enter().append("g");

        node.append("rect")
            .attr("x", function(d) { return d.x0; })
            .attr("y", function(d) { return d.y0; })
            .attr("height", function(d) { return d.y1 - d.y0; })
            .attr("width", function(d) { return d.x1 - d.x0; })
            .attr("fill", function(d) { return color(d.name.replace(/ .*/, "")); })
            .attr("stroke", "#000");

        node.append("text")
            .attr("x", function(d) { return d.x0 - 6; })
            .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .text(function(d) { return d.name; })
          .filter(function(d) { return d.x0 < width / 2; })
            .attr("x", function(d) { return d.x1 + 6; })
            .attr("text-anchor", "start");

        node.append("title")
            .text(function(d) { return d.name + "\n" + format(d.value); });
      });



          
          /*

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
          */
            
        });
      },
    };
  });
