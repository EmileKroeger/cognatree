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
          /*
            .on("click", function(target) {
              var targetData = d3.event.target.__data__;
              console.debug(["click", targetData.name]);
              d3.select(this).style("fill", "red");
            })
          */
            //.on("drag", dragmove)
            .selectAll("g");

        // the function for moving the nodes
            /*
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
            */


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

            function selectNode(targetNode, targetData) {
              // Callback for when a node is selected.
              //console.debug(["click", targetData.fullname]);
              
              //window.target = targetNode;
              //console.debug(targetNode)
              var wasSelected = targetNode.classList.contains("selected");

              // Unselect previous
              var prevSelected = d3.select(".selected")
                .classed("selected", false)
              
              prevSelected.select("rect")
                .attr("stroke-width", 0);

              prevSelected.select("text")
                .attr("font-weight", "normal");

              prevSelected
                .selectAll(".word")
                  .attr("visibility", "hidden")
                
              
              if (wasSelected) {
                // Just unselect, abort now.
                //argetData.show = "collapse";
                return;
              } else {
                //targetNode.show == "visible";
              }

              d3.select(targetNode)
                .classed("selected", true)
                .select("rect")
                  .attr("stroke-width", 1);

              d3.select(targetNode)
                .select("text")
                  .attr("font-weight", "bold");
              //console.debug(targetNode);

              d3.select(targetNode)
                .selectAll(".word")
                  .attr("visibility", "visible")
              
              // Now do something with the data
              console.debug(targetData.topwords);
              console.debug(targetData.topwordinfo);
              
              /*
              d3.select(targetNode)
                .append("text")
                //.data(targetData.topwords)
                .attr("x", function(d) { return targetData.x0; })
                .attr("y", function(d) { return targetData.y1; })
                .attr("dy", "0.40em")
                .attr("text-anchor", "beginning")
                .text(function(d) { console.debug(d); return d;})
              */
              
            }

            node = node
              .data(langdata.nodes)
              .enter().append("g")
                .on("click", function(target) {
                  var targetData = d3.event.target.__data__;
                  selectNode(this, targetData);
                })
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
                .attr("stroke", "black")
                .attr("stroke-width", 0);

            node.append("text")
                .attr("x", function(d) { return d.x0 - 6; })
                .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
                .attr("dy", "0.35em")
                .attr("text-anchor", "end")
                .text(function(d) { return d.fullname})
                //.text(function(d) { return d.fullname + "(" + d.count + ")"})
              .filter(function(d) { return d.x0 < width / 2; })
                .attr("x", function(d) { return d.x1 + 6; })
                .attr("text-anchor", "start");

            node.append("title")
                .text(function(d) { return d.name + "\n" + format(d.value); });
            
            function getNodeWordInfo(nodeData) {
              // Hack
              if (nodeData.show == undefined) {
                nodeData.show = "hidden";
              }

              var info = [];
              nodeData.topwords.forEach(function(word) {
                var wordinfo = nodeData.topwordinfo[word];
                var item = {
                  x: nodeData.x0 - 8,
                  y: (nodeData.y0 + nodeData.y1) / 2,
                  anchor: "end",
                  word: word,
                  finalword: wordinfo[0],
                  parent: nodeData,
                  dy: 15,
                };
                if (nodeData.x0 < width / 2) {
                  // Left half of graph
                  item.x = nodeData.x1 + 8;
                  item.anchor = "start";
                }
                if (item.y > height / 2) {
                  item.dy = -15;
                }
                info.push(item);
              })
              return info;
            }
            
            // Experimental
            var enterWord = node.selectAll(".word")
                .data(getNodeWordInfo)
                //.data(function(d) {return d.topwords; })
            .enter().append('g');
            enterWord.append("rect")
                      .attr("class", "word")
                      .attr("fill", "white")
                      .attr("opacity", "0.9")
                      .attr("visibility", function(d) {return d.parent.show})
                      .attr("x", function(d) {return d.x - 3;})
                      .attr("y", function(d, i) {return d.y + d.dy * (i + 1) - 10;})
                      .attr("height", 15)
                      .attr("width", function(d) { return 80; })
              
            enterWord.append("text")
                      .attr("class", "word")
                      .attr("fill", "black")
                      .attr("visibility", function(d) {return d.parent.show})
                      .attr("text-anchor", function(d) {return d.anchor;})
                      .attr("x", function(d) {return d.x;})
                      .attr("y", function(d, i) {return d.y + d.dy * (i + 1);})
                      .text(function(d) {return d.word + ' (' + d.finalword + ')';})
          });
        });
      },
    };
  });
