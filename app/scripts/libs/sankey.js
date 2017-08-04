// https://github.com/d3/d3-sankey Version 0.7.1. Copyright 2017 Mike Bostock.
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-array'), require('d3-collection'), require('d3-shape')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3-array', 'd3-collection', 'd3-shape'], factory) :
	(factory((global.d3 = global.d3 || {}),global.d3,global.d3,global.d3));
}(this, (function (exports,d3Array,d3Collection,d3Shape) { 'use strict';

function targetDepth(d) {
  return d.target.depth;
}

function left(node) {
  return node.depth;
}

function right(node, n) {
  return n - 1 - node.height;
}

function justify(node, n) {
  return node.sourceLinks.length ? node.depth : n - 1;
}

function center(node) {
  return node.targetLinks.length ? node.depth
      : node.sourceLinks.length ? d3Array.min(node.sourceLinks, targetDepth) - 1
      : 0;
}

function constant(x) {
  return function() {
    return x;
  };
}

function ascendingSourceBreadth(a, b) {
  return ascendingBreadth(a.source, b.source) || a.index - b.index;
}

function ascendingTargetBreadth(a, b) {
  return ascendingBreadth(a.target, b.target) || a.index - b.index;
}

function ascendingBreadth(a, b) {
  return a.y0 - b.y0;
}

function value(d) {
  return d.value;
}

function coeff(link) {
  //return 1;
  return link.value / Math.pow(link.target.x0 - link.source.x1, 1);
}

function nodeCenter(node) {
  return (node.y0 + node.y1) / 2;
}

function nodeRightCenter(node) {
  return node.y0 + node.rightOffset;
}

function weightedSource(link) {
  return nodeRightCenter(link.source) * coeff(link);
}

function weightedTarget(link) {
  return nodeCenter(link.target) * coeff(link);
}

function defaultId(d) {
  return d.index;
}

function defaultNodes(graph) {
  return graph.nodes;
}

function defaultLinks(graph) {
  return graph.links;
}

function find(nodeById, id) {
  var node = nodeById.get(id);
  if (!node) throw new Error("missing: " + id);
  return node;
}

var sankey = function() {
  var x0 = 0, y0 = 0, x1 = 1, y1 = 1, // extent
      dx = 24, // nodeWidth
      py = 8, // nodePadding
      id = defaultId,
      align = justify,
      nodes = defaultNodes,
      links = defaultLinks,
      iterations = 32;

  function sankey() {
    var graph = {nodes: nodes.apply(null, arguments), links: links.apply(null, arguments)};
    computeNodeLinks(graph);
    computeNodeValues(graph);
    computeNodeDepths(graph);
    computeNodeBreadths(graph, iterations);
    computeLinkBreadths(graph);
    return graph;
  }

  sankey.update = function(graph) {
    computeLinkBreadths(graph);
    return graph;
  };

  sankey.nodeId = function(_) {
    return arguments.length ? (id = typeof _ === "function" ? _ : constant(_), sankey) : id;
  };

  sankey.nodeAlign = function(_) {
    return arguments.length ? (align = typeof _ === "function" ? _ : constant(_), sankey) : align;
  };

  sankey.nodeWidth = function(_) {
    return arguments.length ? (dx = +_, sankey) : dx;
  };

  sankey.nodePadding = function(_) {
    return arguments.length ? (py = +_, sankey) : py;
  };

  sankey.nodes = function(_) {
    return arguments.length ? (nodes = typeof _ === "function" ? _ : constant(_), sankey) : nodes;
  };

  sankey.links = function(_) {
    return arguments.length ? (links = typeof _ === "function" ? _ : constant(_), sankey) : links;
  };

  sankey.size = function(_) {
    return arguments.length ? (x0 = y0 = 0, x1 = +_[0], y1 = +_[1], sankey) : [x1 - x0, y1 - y0];
  };

  sankey.extent = function(_) {
    return arguments.length ? (x0 = +_[0][0], x1 = +_[1][0], y0 = +_[0][1], y1 = +_[1][1], sankey) : [[x0, y0], [x1, y1]];
  };

  sankey.iterations = function(_) {
    return arguments.length ? (iterations = +_, sankey) : iterations;
  };

  // Populate the sourceLinks and targetLinks for each node.
  // Also, if the source and target are not objects, assume they are indices.
  function computeNodeLinks(graph) {
    graph.nodes.forEach(function(node, i) {
      node.index = i;
      node.sourceLinks = [];
      node.targetLinks = [];
    });
    var nodeById = d3Collection.map(graph.nodes, id);
    graph.links.forEach(function(link, i) {
      link.index = i;
      var source = link.source, target = link.target;
      if (typeof source !== "object") source = link.source = find(nodeById, source);
      if (typeof target !== "object") target = link.target = find(nodeById, target);
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    });
  }

  // Compute the value (size) of each node by summing the associated links.
  function computeNodeValues(graph) {
    graph.nodes.forEach(function(node) {
      node.leftValue = d3Array.sum(node.targetLinks, value);
      node.rightValue = d3Array.sum(node.sourceLinks, value);
      node.value = Math.max(node.leftValue, node.rightValue);
      //console.debug([node.leftValue, node.rightValue]);
    });
  }

  // Iteratively assign the depth (x-position) for each node.
  // Nodes are assigned the maximum depth of incoming neighbors plus one;
  // nodes with no incoming links are assigned depth zero, while
  // nodes with no outgoing links are assigned the maximum depth.
  function computeNodeDepths(graph) {
    var nodes, next, x;

    for (nodes = graph.nodes, next = [], x = 0; nodes.length; ++x, nodes = next, next = []) {
      nodes.forEach(function(node) {
        node.depth = x;
        node.sourceLinks.forEach(function(link) {
          if (next.indexOf(link.target) < 0) {
            next.push(link.target);
          }
        });
      });
    }

    for (nodes = graph.nodes, next = [], x = 0; nodes.length; ++x, nodes = next, next = []) {
      nodes.forEach(function(node) {
        node.height = x;
        node.targetLinks.forEach(function(link) {
          if (next.indexOf(link.source) < 0) {
            next.push(link.source);
          }
        });
      });
    }

    var kx = (x1 - x0 - dx) / (x - 1);
    graph.nodes.forEach(function(node) {
      node.x1 = (node.x0 = x0 + Math.max(0, Math.min(x - 1, Math.floor(align.call(null, node, x)))) * kx) + dx;
    });
  }

  function computeNodeBreadths(graph) {
    var columns = d3Collection.nest()
        .key(function(d) { return d.x0; })
        .sortKeys(d3Array.ascending)
        .entries(graph.nodes)
        .map(function(d) { return d.values; });

    //
    initializeNodeBreadth();
    resolveCollisions();
    for (var alpha = 1, n = iterations; n > 0; --n) {
      alpha *= 0.99;
      relaxRightToLeft(alpha);
      resolveCollisions();
      relaxLeftToRight(alpha);
      resolveCollisions();
    }

    function initializeNodeBreadth() {
      //ky is the min "squeezing factor"
      function columnSqueeze(nodes) {
        var maxFreeSpace = (y1 - y0 - (nodes.length - 1) * py);
        return maxFreeSpace / d3Array.sum(nodes, value);
      }
      var ky = d3Array.min(columns, function(nodes) {
        return columnSqueeze(nodes);
      });

      columns.forEach(function(nodes) {
        var maxFreeSpace = (y1 - y0 - (nodes.length - 1) * py);
        var usedSpace = d3Array.sum(nodes, value) * ky;
        var freeSpace = maxFreeSpace - usedSpace;
        var padding = freeSpace / (nodes.length + 1)
        var current = 0;
        nodes.forEach(function(node, i) {
          if (i > 0) {
            current += py;
          }
          node.y0 = current + padding;
          node.y1 = node.y0 + node.value * ky;
          current = node.y1;
          // Left and right "middle" of the linked zones
          node.leftOffset = 0.5 * node.leftValue * ky;
          node.rightOffset = 0.5 * node.rightValue * ky;
        });
      });

      graph.links.forEach(function(link) {
        link.width = link.value * ky;
      });
    }
    
    function relaxLeftToRight(alpha) {
      columns.forEach(function(nodes) {
        nodes.forEach(function(node) {
          if (node.targetLinks.length) {
            // Look at this link leftwards, could it be straighter?
            var sourceSum = d3Array.sum(node.targetLinks, weightedSource);
            var valueSum = d3Array.sum(node.targetLinks, coeff);
            var idealCenter = sourceSum / valueSum;
            var dy = (idealCenter - nodeCenter(node)) * alpha;
            node.y0 += dy, node.y1 += dy;
          }
        });
      });
    }

    function relaxRightToLeft(alpha) {
      columns.slice().reverse().forEach(function(nodes) {
        //_relaxColumn(nodes, alpha);
        nodes.forEach(function(node) {
          if (node.sourceLinks.length) {
            // Look at this link rightwards, could it be straigter?
            var targetSum = d3Array.sum(node.sourceLinks, weightedTarget);
            var valueSum = d3Array.sum(node.sourceLinks, coeff);
            var idealCenter = targetSum / valueSum;
            var dy = (idealCenter - nodeRightCenter(node)) * alpha;
            node.y0 += dy, node.y1 += dy;
          }
        });
      });
    }

    function resolveCollisions() {
      columns.forEach(function(nodes) {
        var node,
            dy,
            y = y0,
            n = nodes.length,
            i;

        // Push any overlapping nodes down.
        nodes.sort(ascendingBreadth);
        for (i = 0; i < n; ++i) {
          node = nodes[i];
          dy = y - node.y0;
          if (dy > 0) node.y0 += dy, node.y1 += dy;
          y = node.y1 + py;
        }

        // If the bottommost node goes outside the bounds, push it back up.
        dy = y - py - y1;
        if (dy > 0) {
          y = (node.y0 -= dy), node.y1 -= dy;

          // Push any overlapping nodes back up.
          for (i = n - 2; i >= 0; --i) {
            node = nodes[i];
            dy = node.y1 + py - y;
            if (dy > 0) node.y0 -= dy, node.y1 -= dy;
            y = node.y0;
          }
        }
      });
    }
  }

  function computeLinkBreadths(graph) {
    graph.nodes.forEach(function(node) {
      node.sourceLinks.sort(ascendingTargetBreadth);
      node.targetLinks.sort(ascendingSourceBreadth);
    });
    graph.nodes.forEach(function(node) {
      var y0 = node.y0, y1 = y0;
      node.sourceLinks.forEach(function(link) {
        link.y0 = y0 + link.width / 2, y0 += link.width;
      });
      node.targetLinks.forEach(function(link) {
        link.y1 = y1 + link.width / 2, y1 += link.width;
      });
    });
  }

  return sankey;
};

function horizontalSource(d) {
  return [d.source.x1, d.y0];
}

function horizontalTarget(d) {
  return [d.target.x0, d.y1];
}

var sankeyLinkHorizontal = function() {
  return d3Shape.linkHorizontal()
      .source(horizontalSource)
      .target(horizontalTarget);
};

exports.sankey = sankey;
exports.sankeyCenter = center;
exports.sankeyLeft = left;
exports.sankeyRight = right;
exports.sankeyJustify = justify;
exports.sankeyLinkHorizontal = sankeyLinkHorizontal;

Object.defineProperty(exports, '__esModule', { value: true });

})));
