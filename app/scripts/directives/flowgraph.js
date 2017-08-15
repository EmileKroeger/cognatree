'use strict';

/**
 * @ngdoc directive
 * @name cognatreeApp.directive:flowgraph
 * @description
 * # flowgraph
 */
angular.module('cognatreeApp')
  .directive('flowgraph', function (d3Service, sLangInfo) {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function(scope, element, attrs) {
        d3Service.d3().then(function(d3) {
      
        var width = 1200;
        var height = 600;

        var svg = d3.select(element[0]).append('svg')
          .attr("width", width)
          .attr("height", height)

        var formatNumber = d3.format(",.0f"),
            format = function(d) { return formatNumber(d) + " words"; }, // convert to % ?
            color = d3.scaleOrdinal(d3.schemeCategory10);

        var sankey = d3.sankey()
            .nodeWidth(15)
            .nodePadding(15)
            .nodeAlign(d3.sankeyLeft)
            .iterations(32)
            .extent([[1, 1], [width - 1, height - 6]]);
          
            //console.debug(["it", sankey.iterations()]);

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
            .on("click", function(target) {
              var targetData = d3.event.target.__data__;
              console.debug(["click", targetData.name]);
            })
            //.on("drag", dragmove)
            .selectAll("g");

        // the function for moving the nodes
          function dragmove(d) {
            console.debug("dragmove");
            d3.select(this)
              .attr("transform", 
                    "translate(" 
                       + d.x + "," 
                       + (d.y = Math.max(
                          0, Math.min(height - d.dy, d3.event.y))
                         ) + ")");
            //sankey.relayout();
            link.attr("d", path);
          }


          d3.json("data/parentgraphlinks_eng.json", function(error, langdata) {
            if (error) throw error;

            sankey(langdata);

            link = link
              .data(langdata.links)
              .enter().append("path")
                .attr("d", d3.sankeyLinkHorizontal())
                .attr("stroke-width", function(d) { return Math.max(1, d.width); })
                .attr("stroke", function(d) { 
                  return sLangInfo.colors[d.family];
                });

            link.append("title")
                .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });

            node = node
              .data(langdata.nodes)
              .enter().append("g")
                /*
            .call(d3.drag()
              .subject(function(d) {
                return d;
              })
              .on("start", function() {
                this.parentNode.appendChild(this);
              })
              .on("drag", dragmove))
                */

            node.append("rect")
                .attr("x", function(d) { return d.x0; })
                .attr("y", function(d) { return d.y0; })
                .attr("height", function(d) { return d.y1 - d.y0; })
                .attr("width", function(d) { return d.x1 - d.x0; })
                .attr("fill", function(d) { 
                  return sLangInfo.colors[d.family];
                })
                .attr("stroke-width", 0);

            node.append("text")
                .attr("x", function(d) { return d.x0 - 6; })
                .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
                .attr("dy", "0.35em")
                .attr("text-anchor", "end")
                .text(function(d) { return d.fullname})
              .filter(function(d) { return d.x0 < width / 2; })
                .attr("x", function(d) { return d.x1 + 6; })
                .attr("text-anchor", "start");

            node.append("title")
                .text(function(d) { return d.name + "\n" + format(d.value); });
          });
        });
      },
    };
  });
