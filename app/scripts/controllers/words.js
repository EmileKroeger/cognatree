'use strict';

/**
 * @ngdoc function
 * @name cognatreeApp.controller:WordsCtrl
 * @description
 * # WordsCtrl
 * Controller of the cognatreeApp
 */
angular.module('cognatreeApp')
  .controller('WordsCtrl', function ($scope, $http, sLangInfo) {
    //var WORDINDEX_URL = 'data/majorworddescs.json';
    var WORDINDEX_URL = 'data/majorworddescs20.json';
    $scope.families = sLangInfo.majorfamilies;
    $scope.colors = sLangInfo.colors;
    $http.get(WORDINDEX_URL).success(function(worddescs) {
      $scope.worddescs = worddescs;
    });
    // Helpers for display
    $scope.getcellcolor = function(worddesc, family) {
      if (worddesc[family]) {
        return sLangInfo.colors[family];
      } else {
        return "white";
      }
    }
  });
