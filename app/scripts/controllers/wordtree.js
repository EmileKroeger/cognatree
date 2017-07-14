'use strict';

/**
 * @ngdoc function
 * @name cognatreeApp.controller:WordtreeCtrl
 * @description
 * # WordtreeCtrl
 * Controller of the cognatreeApp
 */
angular.module('cognatreeApp')
  .service('sLangInfo', function ($http) {
    var LANGINFO_URL = 'data/langinfo.json';
    var state = {
      langInfo: null,
      running: false,
      callbacks: [],
    };
    function onReady(callback) {
      if (state.langInfo) {
        // We're already done here!
        callback(state.langInfo);
      } else {
        // We'll get called later on
        state.callbacks.push(callback);
        if (!state.running) {
          // Request data
          state.running = true;
          $http.get(LANGINFO_URL).success(function(langInfo) {
            state.langInfo = state.langInfo;
            state.running = false;
            state.callbacks.forEach(function(callback) {
              callback(langInfo);
            });
            state.callbacks = [];
          });
        }
      }
    }
    var MAJORFAMILIES = [
      '?',
      'Celtic',
      'Romance',
      'Germanic',
      'Slavic',
      'Greek',
      'Indo-Iranian',
    ];
    var FAMILIES = [
      undefined, // proto-indo-european
      '?',
      'Celtic',
      'Celtic / Goidelic',
      'Celtic / Brittonic',
      'Celtic / Continental',
      'Osco-Umbrian',
      'Romance',
      'Romance / Iberian',
      'Romance / Gallic',
      'Romance / Gallic / Occitan',
      'Romance / Gallic / Oil',
      'Romance / Gallic / Rhaetian',
      'Romance / Italo-Dalmatian',
      'Romance / Sardinian',
      'Romance / Eastern',
      'Germanic',
      'Germanic / West',
      'Germanic / West / Anglo-Frisian',
      'Germanic / West / Low Franconian',
      'Germanic / West / High German',
      'Germanic / North',
      'Germanic / North / West',
      'Germanic / North / East',
      'Germanic / East',
      'Slavic',
      'Slavic / West',
      'Slavic / Balto-Slavic',
      'Albanian',
      'Greek',
      'Anatolian',
      'Armenian',
      'Indo-Iranian',
    ];
    var FAMCOLORS = {
      null: '#aaaaaa',
      '?': '#aaaaaa',
      'Celtic': '#00ff00',
      'Osco-Umbrian': '#00ffff',
      'Romance': '#00ffff',
      'Germanic': '#6666ff',
      'Slavic': '#dd00dd',
      'Albanian': '#cccccc',
      'Greek': '#ff6622',
      'Anatolian': '#cccccc',
      'Armenian': '#cccccc',
      'Indo-Iranian': '#ffff00',
    };
    function getPathColor(path) {
      if (path) {
        var basefamily = path[0];
        // Someday: maybe something smarter
        return FAMCOLORS[basefamily];
      } else {
        return FAMCOLORS[null];
      }
    }
    function getColor(family) {
      if (family) {
        return getPathColor(family.split(" / "));
      } else {
        return FAMCOLORS[null];
      }
    }

    return {
      onReady: onReady,
      colors: FAMCOLORS,
      getColor: getColor,
      getPathColor: getPathColor,
      majorfamilies: MAJORFAMILIES,
      families: FAMILIES,
    };
  })
  .controller('WordtreeCtrl', function ($scope, $routeParams, $http, sLangInfo) {
    // Prepare families
    sLangInfo.onReady(function(langInfo) {
      //console.log('got lang info:');
      //console.debug(langInfo);
    });

    // Handle word
    console.debug($routeParams.word);
    $scope.word = $routeParams.word;
    var wordurl = 'data/families/english/' + $scope.word + '.json';
    $scope.branches = [];
    $http.get(wordurl).
    success(function(familydata) {
      //console.debug('data:');
      //console.debug(familydata);
      $scope.meaning = familydata._MEANING;
      delete familydata._MEANING;
      var byFamily = {};
      sLangInfo.onReady(function(langInfo) {
        // Data format: tree
        var langTree = {
          items: [],
          color: sLangInfo.getColor(null),
          children: {},
        };
        // insertion function
        function insertInTree(node, path, item) {
          //console.debug(["Inserting into", path, node]);
          if (path && path.length) {
            var head = path[0];
            var tail = path.slice(1);
            if (!node.children[head]) {
              node.children[head] = {
                items: [],
                // TODO: this only works with no subcolors...
                color: sLangInfo.getColor(item.family),
                children: {},
              };
            }
            //console.log("inserting into " + head);
            insertInTree(node.children[head], tail, item);
          } else {
            //console.log("end up at " + item.family);
            //console.debug(path);
            node.items.push(item);
          }
        }
        // Now let's process all our languages to build our tree
        //angular.forEach(sLangInfo.families, function(family) {
        angular.forEach(familydata, function(wordInLang, lang) {
          if (wordInLang) {
            var family = '?';
            var color = 'lightgrey';
            var importance = 0;
            if (langInfo[lang]) {
              family = langInfo[lang].Family;
              color = sLangInfo.getColor(family);
              importance = langInfo[lang].importance;
            }
            var entry = {
              family: family,
              color: color,
              lang: lang,
              writing: wordInLang[0],
              pronunciation: wordInLang[1],
              importance: importance,
            };
            //console.debug([lang, family]);
            if (!byFamily[family]) {
              var branch = {
                color: color,
                family: family,
                important: [],
                minor: [],
                expanded: false,
              };
              byFamily[family] = branch;
            }
            if (importance >= 2) {
              byFamily[family].important.push(entry);
            } else {
              byFamily[family].minor.push(entry);
            }
            delete familydata[lang];
          }
        });
        // Next: take those by family, insert them in the tree IN ORDER
        angular.forEach(sLangInfo.families, function(family) {
          var branch = byFamily[family];
          if (branch) {
            var parts = [];
            if (family) {
              parts = family.split(" / ");
            }
            branch.parts = parts;
            insertInTree(langTree, parts, branch);
          }
        });
        // Remove from tree items with no children nor important
        // languages
        function pruneTree(node) {
          // Return a pruned copy of self
          var prunedChildren = {}
          angular.forEach(node.children, function(child, key) {
            var prunedChild = pruneTree(child);
            if (prunedChild) {
              prunedChildren[key] = prunedChild;
            } else {
              //console.log("DBG pruning " + key);
            }
          });
          var hasWords = false;
          if (node.items.length > 0) {
            hasWords = node.items[0].important.length > 0;
          }
          if (!hasWords && angular.equals(prunedChildren, {})) {
            return null;
          } else {
            return {
              items: node.items,
              color: node.color,
              children: prunedChildren,
            };
          }
        }
        langTree = pruneTree(langTree);
        // now: flatten langtree into a table!
        // First step: calculate width.
        function addWidth(node) {
          node.width = 0;
          angular.forEach(node.children, function(child) {
            addWidth(child);
            node.width += child.width;
          });
          if (node.width <= 0) {
            node.width = 1;
          }
        }
        addWidth(langTree);
        // Now fill in the table.
        var langTable = [];
        function addInTable(node, label, depth, fulldepth) {
          while (langTable.length < depth) {
            langTable.push([]);
          }
          var cell = {
            branch: null,
            width: node.width,
            color: node.color,
            depth: 1,
            label: label,
            hassiblings: false,
            haschildren: true,
          };
          if (angular.equals(node.children, {})) {
            cell.depth = fulldepth;
            cell.haschildren = false;
          }
          if (node.items) {
            cell.branch = node.items[0];
          }
          langTable[depth - 1].push(cell);
          var lastChild = null;
          angular.forEach(node.children, function(child, branchname) {
            var newChild = addInTable(child, branchname, depth + 1, fulldepth-1);
            if (lastChild) {
              lastChild.hassiblings = true;
              lastChild.siblingcolor = newChild.color;
            }
            lastChild = newChild;
          });
          return cell;
        }
        var rootCell = addInTable(langTree, "IE", 1, 4);
        window.langTable = langTable;
        $scope.langTable = langTable;
      });
      
    }).
    error(function(data, status) {
      console.debug('error');
      console.debug(status);
    });
    
  });
