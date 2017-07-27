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
    var WORDINDEX_URL = 'data/majorworddescs.json';
    //WORDINDEX_URL = 'data/majorworddescs20.json';
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

    // Keep track of which families we want to track
    $scope.filterKey = null;
    $scope.toggleFilter = function(family) {
      if ($scope.filterKey === family) {
        $scope.filterKey = null;
      } else {
        $scope.filterKey = family;
      }
    };
    $scope.checkDecoration = function(family) {
      if ($scope.filterKey === family) {
        return "underline";
      }
    }
    
    // Handle different kinds of sort
    function setBreadthSort() {
      $scope.sortname = "count";
      $scope.sortkey = "-sortcount";
    }
    function setMeaningSort() {
      $scope.sortname = "meaning";
      $scope.sortkey = "meaning";
    }
    setBreadthSort()
    $scope.toggleSort = function() {
      if ($scope.sortname == "meaning") {
        setBreadthSort();
      } else {
        setMeaningSort();
      }
      
    }
    /*
    // Overkill: opacity is fine
    $scope.getdarkcolor = function(family) {
      var basecolor = sLangInfo.colors[family];
      var colorcode = parseInt("0x" + basecolor.slice(1));
      var darkcode = 0;
      // decompose r g b components
      [0xff0000, 0x00ff00, 0x0000ff].forEach(function(comp) {
        darkcode += ((colorcode & comp) / 2) & comp;
      })
      var darkcolor = "#" + darkcode.toString(16);
      console.log("" + basecolor + " -> " + darkcolor);
      return darkcolor
    }
    */
  });
