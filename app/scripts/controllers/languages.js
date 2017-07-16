'use strict';

/**
 * @ngdoc function
 * @name cognatreeApp.controller:LanguagesCtrl
 * @description
 * # LanguagesCtrl
 * Controller of the cognatreeApp
 */
angular.module('cognatreeApp')
  .controller('LanguagesCtrl', function ($scope, $http, sLangInfo, sTreeTable) {
    // Old: dendrogram
    $scope.dtree = null;;
    $http.get('data/dendogram.json').
      success(function(data, status, headers, config) {
        //console.debug('data:')
        //console.debug(data)
        //$scope.$apply(function() {
          $scope.dtree = data;
          //});
      }).
      error(function(data, status, headers, config) {
        console.debug('error')
        console.debug(status)
      });
      // Newer: family tree
      sLangInfo.onReady(function(langInfo) {
        //console.log('got lang info:');
        //console.debug(langInfo);
        var families = [];
        angular.forEach(langInfo, function(langDic, lang) {
          //console.log(lang + " " + langDic.Family);
          var family = langDic.Family
          if (families.indexOf(family) == -1) {
            families.push(family);
          }
        });
        families.sort();
        families.forEach(function (family) {
          //console.log(family);
        });
        $scope.families = families;
      });
      
      sLangInfo.onReady(function(langInfo) {
        // Data format: tree
        var langTree = {
          items: [],
          color: sLangInfo.getColor(null),
          children: {},
        };
        var byFamily = {}
        // Now let's process all our languages to build our tree
        angular.forEach(langInfo, function(langParams, lang) {
          var family = langParams.Family;
          var color = sLangInfo.getColor(family);
          var importance = langParams.importance;
          var entry = {
            family: family,
            color: color,
            lang: lang,
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
          if (importance >= 0) {
            byFamily[family].important.push(entry);
          } else {
            byFamily[family].minor.push(entry);
          }
        });
        // Next: take those by family, insert them in the tree IN ORDER
        angular.forEach(sLangInfo.families, function(family) {
          // TODO: figure out families
          //console.log("Inserting: " + family)
          var branch = byFamily[family];
          if (branch) {
            var parts = [];
            if (family) {
              parts = family.split(" / ");
            }
            branch.parts = parts;
            sTreeTable.insertInTree(langTree, parts, branch);
          }
        });
        // Remove from tree items with no children nor important
        // languages
        langTree = sTreeTable.pruneTree(langTree);
        // now: flatten langtree into a table!
        sTreeTable.addWidth(langTree);
        var langTable = [];
        var rootCell = sTreeTable.addInTable(langTable, langTree, "IE", 1, 6);
        window.langTable = langTable;
        $scope.langTable = langTable;
      });

  });
