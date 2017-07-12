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
          });
        }
      }
    }
    var FAMCOLORS = {
      'Albanian': '#ffffff',
      'Anatolian': '#ffffff',
      'Armenian': '#ffffff',
      'Celtic / Brittonic': '#ffffff',
      'Celtic / Continental': '#ffffff',
      'Celtic / Goidelic': '#ffffff',
      'Germanic / East': '#00ffff',
      'Germanic / North': '#00aaff',
      'Germanic / North / East': '#3399ff',
      'Germanic / North / West': '#6688ff',
      'Germanic / West / Anglo-Frisian': '#0022ff',
      'Germanic / West / High German': '#2211ff',
      'Germanic / West / Low Franconian': '#4400ff',
      'Greek': '#ffffff',
      'Indo-Iranian': '#ffff00',
      'Oriya': '#ffffff',
      'Osco-Umbrian': '#ffffff',
      'Romance': '#ff00ff',
      'Romance / Eastern': '#ff00ff',
      'Romance / Gallic / Occitan': '#ff00ff',
      'Romance / Gallic / Oil': '#ff00ff',
      'Romance / Gallic / Rhaetian': '#ff00ff',
      'Romance / Iberian': '#ff00ff',
      'Romance / Italo-Dalmatian': '#ff00ff',
      'Romance / Sardinian': '#ff00ff',
      'Slavic': '#00ff00',
      'Slavic / Balto-Slavic': '#00ff00',
      'Slavic / West': '#00ff00',
      };

    return {
      onReady: onReady,
      colors: FAMCOLORS,
    };
  })
  .controller('WordtreeCtrl', function ($scope, $routeParams, $http, sLangInfo) {
    // Prepare families
    sLangInfo.onReady(function(langInfo) {
      console.log('got lang info:');
      console.debug(langInfo);
    });

    // Handle word
    console.debug($routeParams.word);
    $scope.word = $routeParams.word;
    var wordurl = 'data/families/english/' + $scope.word + '.json';
    $scope.branches = [];
    $http.get(wordurl).
    success(function(familydata) {
      console.debug('data:');
      console.debug(familydata);
      $scope.meaning = familydata._MEANING;
      delete familydata._MEANING;
      var byFamily = {};
      sLangInfo.onReady(function(langInfo) {
        // Data format: tree
        var langTree = {
          items: [],
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
        angular.forEach(familydata, function(wordInLang, lang) {
          if (wordInLang) {
            var family = '?';
            var color = 'lightgrey';
            var importance = 0;
            if (langInfo[lang]) {
              family = langInfo[lang].Family;
              color = sLangInfo.colors[family];
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
            if (!byFamily[family]) {
              var parts = [];
              if (family) {
                parts = family.split(" / ");
              }
              var branch = {
                family: family,
                parts: parts,
                important: [],
                minor: [],
                expanded: false,
              };
              byFamily[family] = branch;
              console.log("processing family: " + family);
              insertInTree(langTree, parts, branch);
            }
            if (importance >= 2) {
              byFamily[family].important.push(entry);
            } else {
              byFamily[family].minor.push(entry);
            }
            delete familydata[lang];
          }
        });
        //$scope.langTree = langTree; // should be done by now
        $scope.byFamily = byFamily;
        $scope.familydata = familydata;
        //window.familydata = familydata;
        window.langTree = langTree;
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
        // Now fill in the table.l
        var langTable = [];
        function addInTable(node, label, depth, fulldepth) {
          while (langTable.length < depth) {
            langTable.push([]);
          }
          var cell = {
            branch: null,
            width: node.width,
            depth: 1,
            label: label,
          };
          if (angular.equals(node.children, {})) {
            cell.depth = fulldepth;
          }
          if (node.items) {
            cell.branch = node.items[0];
          }
          langTable[depth - 1].push(cell);
          angular.forEach(node.children, function(child, branchname) {
            addInTable(child, branchname, depth + 1, fulldepth-1);
          });
        }
        addInTable(langTree, "IE", 1, 4);
        window.langTable = langTable;
        $scope.langTable = langTable;
      });
      
    }).
    error(function(data, status) {
      console.debug('error');
      console.debug(status);
    });
    
  });
