'use strict';

/**
 * @ngdoc function
 * @name cognatreeApp.controller:LanguagesCtrl
 * @description
 * # LanguagesCtrl
 * Controller of the cognatreeApp
 */
angular.module('cognatreeApp')
  .controller('LanguagesCtrl', function ($scope, $http, sLangInfo) {
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
          console.log(family);
        });
        $scope.families = families;
      });
      
  });
