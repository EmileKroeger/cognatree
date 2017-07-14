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
    $scope.families = sLangInfo.families;
    $scope.colors = sLangInfo.colors;
    $http.get(WORDINDEX_URL).success(function(worddescs) {
      $scope.worddescs = worddescs;
    });
  });
